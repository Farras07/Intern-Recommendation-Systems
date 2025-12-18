jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  firestore: () => ({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
  }),
}));



// mock JSX email templates so Jest doesn't parse them
jest.mock('@/constant/email_template/InviteAlert', () => () => '<InviteAlertEmail />');
jest.mock('@/constant/email_template/RegisterAlertEmail', () => () => '<RegisterAlertEmail />');
jest.mock('@/constant/email_template/InterviewInvitation', () => () => '<InterviewInvitation />');
jest.mock('@/constant/email_template/InterviewInvitationJudge', () => () => '<InterviewInvitationJudge />');
