// __mocks__/EmailServices.ts
import nodemailer from 'nodemailer';

// Mock the nodemailer transport object
const sendMailMock = jest
  .fn()
  .mockResolvedValue({ accepted: ['test@example.com'] });

nodemailer.createTransport = jest.fn().mockReturnValue({
  sendMail: sendMailMock,
});

// Mock class
export default class EmailServices {
  constructor() {}

  sendEmail = jest.fn().mockResolvedValue(true);
  sendInterviewInvitationEmailJudge = jest.fn().mockResolvedValue(true);
  sendInterviewInvitationEmail = jest.fn().mockResolvedValue(true);
  sendAcceptanceEmail = jest.fn().mockResolvedValue(true);
  sendRejectionIntern = jest.fn().mockResolvedValue(true);

  // If you want the test to check transporter internal behavior:
  static __sendMail = sendMailMock;
}
