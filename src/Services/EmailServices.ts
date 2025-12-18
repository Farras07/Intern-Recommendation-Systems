import React from 'react';
import nodemailer, { Transporter } from 'nodemailer';
import { render } from '@react-email/render';
import InviteAlertEmail from '@/constant/email_template/InviteAlert';
import RegisterAlertEmail from '@/constant/email_template/RegisterAlertEmail';
import InterviewInvitationEmail from '@/constant/email_template/InterviewInvitation';
import InterviewInvitationEmailJudge from '@/constant/email_template/InterviewInvitationJudge';
import AcceptanceInternEmail from '@/constant/email_template/AcceptanceIntern';
import RejectionInternEmail from '@/constant/email_template/RejectionIntern';

export default class EmailServices {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.DEV_EMAIL,
        pass: process.env.DEV_PASS,
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
      from: process.env.DEV_EMAIL,
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
      from: process.env.DEV_EMAIL,
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
      from: process.env.DEV_EMAIL,
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
  async sendAcceptanceEmail(
    name: string,
    email: string,
    batch: string,
    role: string,
    pdfBuffer?: Buffer,
  ) {
    const emailHtml = await render(
      React.createElement(AcceptanceInternEmail, { name, batch, role }),
    );

    const mailOptions = {
      from: process.env.DEV_EMAIL,
      to: email,
      subject: `Application Accepted for ${role} role`,
      html: emailHtml,
      attachments: [
        {
          filename: 'Candidates Accepted List.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendRejectionIntern(
    name: string,
    email: string,
    batch: string,
    role: string,
  ) {
    const emailHtml = await render(
      React.createElement(RejectionInternEmail, { name, batch, role }),
    );

    const mailOptions = {
      from: process.env.DEV_EMAIL,
      to: email,
      subject: `Application Rejection for ${role} role`,
      html: emailHtml,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
