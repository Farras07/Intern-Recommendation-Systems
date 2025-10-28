import { google } from 'googleapis';
import BaseError from '@/exceptions/BaseError';
import InternalServerError from '@/exceptions/InternalServerError';
import {
  InterviewerType,
  RecommendationType,
  ShortlistRecommendationType,
} from '@/types/RecommendationTypes';
import { addMinutesUTC, UTCToLocalTimezone } from '@/hooks/date-format.hooks';
import EmailServices from './EmailServices';
import InternServices from './InternServices';
import { generateTopRankPDF } from '@/lib/pdfGenerator';

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

export default class MeetServices {
  private _emailServices: EmailServicesType;
  private _internServices: InternServicesType;

  constructor(internServices: InternServicesType) {
    this._emailServices = new EmailServices();
    this._internServices = internServices;
  }

  // ✅ Main Entry
  async createMeet(payload: CreateMeetProps) {
    try {
      const { session, values, candidates } = payload;

      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: session.accessToken });

      const calendar = google.calendar({ version: 'v3', auth });

      // Base start time in UTC

      const recomData = await this._createCalendarEvents(
        calendar,
        candidates.recommendation,
        values,
      );

      const pdfBuffer = await generateTopRankPDF(recomData, candidates.batch);
      const regisData: any[] = [];

      await this._handleEmailsAndRegistrationUpdates(
        recomData,
        regisData,
        candidates,
        values.interviewer,
        pdfBuffer,
      );
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  // 🗓️ Handle Google Meet creation for all roles
  private async _createCalendarEvents(
    calendar: any,
    recommendations: RecommendationType[],
    // baseStartTimeUTC: string, // UTC ISO
    values: ShortlistRecommendationType,
  ) {
    const recomData: RecommendationType[] = [];

    for (const recom of recommendations) {
      const topRank = recom.rank
        .sort((a, b) => a.rank - b.rank)
        .slice(0, values.candidateAmount);

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

          // Prepare for next session batch
          currentStartUTC = addMinutesUTC(currentStartUTC, 60);
          remainingSession = 60;
          batchEmails = [];
        }
      }

      recom.interviewDate = values.interviewDate; // store UTC
      recom.rank = topRank;
      recomData.push(recom);
    }

    return recomData;
  }

  // 📅 Create Google Meet Event
  private async _createMeetEvent(
    calendar: any,
    role: string,
    startTimeUTC: string, // UTC ISO
    attendees: { email: string }[],
  ) {
    const endTimeUTC = addMinutesUTC(startTimeUTC, 60);

    const event = {
      summary: `Interview for ${role}`,
      description: `Interview session for ${role} candidates`,
      start: {
        dateTime: startTimeUTC, // ISO string
        timeZone: 'Asia/Jakarta', // This is key
      },
      end: {
        dateTime: endTimeUTC,
        timeZone: 'Asia/Jakarta',
      },
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

  // 💌 Handle Email Sending + Registration DB Updates
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
            await this._internServices.getSpecificRegistration(
              rankData.applyId,
            );
          regisData.push(registrationData);
        }
        await this._emailServices.sendInterviewInvitationEmail(
          rankData.candidateName,
          rankData.candidateEmail,
          candidates.batch,
          recom.role,
          pdfBuffer,
        );
      }
      judges.map(async (judge: InterviewerType) => {
        if (judge.role === recom.role) {
          judge.judgesEmail.map(async email => {
            await this._emailServices.sendInterviewInvitationEmailJudge(
              email,
              candidates.batch,
              recom.role,
              pdfBuffer,
            );
          });
        }
      });
    }

    // Update vacancies in DB
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

        await this._internServices.updateRegistrationData(rankData.applyId, {
          vacancy: updatedVacancies,
        });
      }
    }
  }
}
