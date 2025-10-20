import React from 'react';
import nodemailer from 'nodemailer';
import { generateTopRankPDF } from '@/lib/pdfGenerator';
import { render } from '@react-email/render';
import InviteAlertEmail from '@/constant/email_template/InviteAlert';
import RegisterAlertEmail from '@/constant/email_template/RegisterAlertEmail';
import InterviewInvitationEmail from '@/constant/email_template/InterviewInvitation';
import InterviewInvitationEmailJudge from '@/constant/email_template/InterviewInvitationJudge';

export default class EmailServices {
  transporter: typeof nodemailer.createTransport;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_DEV_EMAIL,
        pass: process.env.NEXT_PUBLIC_DEV_PASS,
      },
      tls: { rejectUnauthorized: false },
      secure: true,
    });
  }

  async sendEmail({
    email,
    role,
    name,
  }: {
    email: string;
    role?: string;
    name?: string;
  }) {
    let emailHtml;

    if (role)
      emailHtml = await render(React.createElement(InviteAlertEmail, { role }));
    else if (name)
      emailHtml = await render(
        React.createElement(RegisterAlertEmail, { name }),
      );

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_DEV_EMAIL,
      to: email,
      subject: 'Test',
      html: emailHtml,
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendInterviewInvitationEmailJudge(
    email: string,
    batch: string,
    role: string,
    pdfBuffer: Buffer,
  ) {
    const emailHtml = await render(
      React.createElement(InterviewInvitationEmailJudge, { batch, role }),
    );

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_DEV_EMAIL,
      to: email,
      subject: `Interview Invitation Judge for ${role}`,
      html: emailHtml,
      attachments: [
        {
          filename: 'Interview Candidates List.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendInterviewInvitationEmail(
    name: string,
    email: string,
    batch: string,
    role: string,
    pdfBuffer: Buffer,
  ) {
    const emailHtml = await render(
      React.createElement(InterviewInvitationEmail, { name, batch, role }),
    );

    const mailOptions = {
      from: process.env.NEXT_PUBLIC_DEV_EMAIL,
      to: email,
      subject: `Interview Invitation for ${role}`,
      html: emailHtml,
      attachments: [
        {
          filename: 'Interview Candidates List.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await this.transporter.sendMail(mailOptions);
  }
}
