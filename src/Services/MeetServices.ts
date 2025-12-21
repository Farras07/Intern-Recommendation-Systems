import { google } from 'googleapis';
import { getAdminDb } from '@/lib/firebase-admin';
import BaseError from '@/exceptions/BaseError';
import InternalServerError from '@/exceptions/InternalServerError';
import {
  InterviewerType,
  RecommendationType,
  ShortlistRecommendationType,
} from '@/types/RecommendationTypes';
import { addMinutesUTC } from '@/hooks/date-format.hooks';
import EmailServices from './EmailServices';
import InternServices from './InternServices';
import { generateTopRankPDF } from '@/lib/pdfGenerator';
import RegisterServices from './RegisterServices';

const db = getAdminDb();
const registerServices = new RegisterServices(db);

type CreateMeetProps = {
  session: {
    accessToken: string;
    name: string;
    email: string;
  };
  values: ShortlistRecommendationType;
  candidates: {
    batch: string;
    recommendation: RecommendationType[];
  };
};

type EmailServicesType = InstanceType<typeof EmailServices>;
type InternServicesType = InstanceType<typeof InternServices>;
type RegisterServicesType = InstanceType<typeof RegisterServices>;

export default class MeetServices {
  private _emailServices: EmailServicesType;
  private _internServices: InternServicesType;
  private _registerServices: RegisterServicesType;

  constructor(internServices: InternServicesType) {
    this._emailServices = new EmailServices();
    this._internServices = internServices;
    this._registerServices = registerServices;
  }

  // ✅ Main entry point
  async createMeet(payload: CreateMeetProps) {
    try {
      const { session, values, candidates } = payload;

      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: session.accessToken });

      const calendar = google.calendar({ version: 'v3', auth });

      // Create calendar events and get both top-ranked and excluded candidates
      const { recomData, excludedCandidates } =
        await this._createCalendarEvents(
          calendar,
          candidates.recommendation,
          values,
        );

      const pdfBuffer = await generateTopRankPDF(recomData, candidates.batch);
      const regisData: any[] = [];

      // Handle interview invitation emails & DB update
      await this._handleEmailsAndRegistrationUpdates(
        recomData,
        regisData,
        candidates,
        values.interviewer,
        pdfBuffer,
      );

      // ✅ Handle rejection emails for excluded candidates
      await this._sendRejectionEmails(excludedCandidates, candidates.batch);

      return pdfBuffer;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  // 🗓️ Create Google Meet events for each role
  private async _createCalendarEvents(
    calendar: any,
    recommendations: RecommendationType[],
    values: ShortlistRecommendationType,
  ) {
    const recomData: RecommendationType[] = [];
    const excludedCandidates: any[] = [];

    for (const recom of recommendations) {
      // Top N candidates
      const topRank = recom.rank
        .sort((a, b) => a.rank - b.rank)
        .slice(0, values.candidateAmount);

      // Others (excluded)
      const rejectedCandidate = recom.rank.filter(
        cand =>
          !topRank.some(top => top.candidateEmail === cand.candidateEmail),
      );

      // Schedule meets for top-ranked
      let currentStartUTC = values.interviewDate;
      let remainingSession = 60;
      let batchEmails: { email: string }[] = [];
      let candidateIndex = 0;

      const matchingInterviewer = values.interviewer.find(
        intv => intv.role === recom.role,
      );

      for (let i = 0; i < topRank.length; i++) {
        batchEmails.push({ email: topRank[i].candidateEmail });

        if (matchingInterviewer && i === 0) {
          const judgeEmails = matchingInterviewer.judgesEmail.map(
            (email: string) => ({ email }),
          );
          batchEmails.push(...judgeEmails);
        }

        remainingSession -= values.durationTime;
        const isLast = i === topRank.length - 1;

        if (remainingSession <= 0 || isLast) {
          const meetEvent = await this._createMeetEvent(
            calendar,
            recom.role,
            currentStartUTC,
            batchEmails,
          );

          const meetLink = meetEvent.hangoutLink;
          let sessionTimeUTC = currentStartUTC;

          for (; candidateIndex <= i; candidateIndex++) {
            const candidate = topRank[candidateIndex];
            candidate.link = meetLink;
            candidate.interviewTime = sessionTimeUTC;
            sessionTimeUTC = addMinutesUTC(sessionTimeUTC, values.durationTime);
          }

          // Reset for next session batch
          currentStartUTC = addMinutesUTC(currentStartUTC, 60);
          remainingSession = 60;
          batchEmails = [];
        }
      }

      recom.interviewDate = values.interviewDate; // store UTC
      recom.rank = topRank;
      recomData.push(recom);

      // Push rejected ones to global list
      rejectedCandidate.forEach(rc =>
        excludedCandidates.push({ ...rc, role: recom.role }),
      );
    }

    return { recomData, excludedCandidates };
  }

  // 📅 Create Google Meet Event
  private async _createMeetEvent(
    calendar: any,
    role: string,
    startTimeUTC: string,
    attendees: { email: string }[],
  ) {
    const endTimeUTC = addMinutesUTC(startTimeUTC, 60);

    const event = {
      summary: `Interview for ${role}`,
      description: `Interview session for ${role} candidates`,
      start: { dateTime: startTimeUTC, timeZone: 'Asia/Jakarta' },
      end: { dateTime: endTimeUTC, timeZone: 'Asia/Jakarta' },
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `req-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    return response.data;
  }

  // 💌 Handle interview invitation & DB update
  private async _handleEmailsAndRegistrationUpdates(
    recomData: RecommendationType[],
    regisData: any[],
    candidates: any,
    judges: any,
    pdfBuffer: Buffer,
  ) {
    for (const recom of recomData) {
      for (const rankData of recom.rank) {
        const alreadyFetched = regisData.some(r => r.id === rankData.applyId);
        if (!alreadyFetched) {
          const registrationData =
            await this._registerServices.getSpecificRegistration(
              rankData.applyId,
            );
          regisData.push(registrationData);
        }

        // Send interview invitation to candidate
        await this._emailServices.sendInterviewInvitationEmail(
          rankData.candidateName,
          rankData.candidateEmail,
          candidates.batch,
          recom.role,
          pdfBuffer,
        );
      }

      // Send interview invitation to judges
      for (const judge of judges) {
        if (judge.role === recom.role) {
          for (const email of judge.judgesEmail) {
            await this._emailServices.sendInterviewInvitationEmailJudge(
              email,
              candidates.batch,
              recom.role,
              pdfBuffer,
            );
          }
        }
      }
    }

    // Update DB for interview stage
    for (const recom of recomData) {
      for (const rankData of recom.rank) {
        const regisIndex = regisData.findIndex(r => r.id === rankData.applyId);
        if (regisIndex === -1) continue;

        const regis = regisData[regisIndex];
        const updatedVacancies = regis.vacancy.map((vac: any) =>
          vac.id === rankData.vacancyId
            ? { ...vac, lastStage: 'Interview' }
            : vac,
        );

        regisData[regisIndex] = { ...regis, vacancy: updatedVacancies };
        await this._registerServices.updateRegistrationData(rankData.applyId, {
          vacancy: updatedVacancies,
        });
      }
    }
  }

  // ❌ Send rejection emails to excluded candidates
  async _sendRejectionEmails(excludedCandidates: any[], batch: string) {
    for (const candidate of excludedCandidates) {
      await this._emailServices.sendRejectionIntern(
        candidate.candidateName,
        candidate.candidateEmail,
        batch,
        candidate.role,
      );
    }
  }
}
