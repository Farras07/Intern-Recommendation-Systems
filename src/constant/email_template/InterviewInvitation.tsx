import { Html } from '@react-email/html';
import { Tailwind } from '@react-email/tailwind';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Button } from '@react-email/button';
import { Img } from '@react-email/img';

type InterviewInviteEmailProps = {
  name: string;
  batch: string;
  role: string;
};

const InterviewInvitationEmail: React.FC<InterviewInviteEmailProps> = ({
  name,
  batch,
  role,
}) => {
  return (
    <Html>
      <Tailwind>
        {/* Full background */}
        <div style={{ backgroundColor: '#458FFF', padding: '40px 0' }}>
          <Section
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '500px',
              margin: '0 auto',
              padding: '32px 24px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
            }}
          >
            <h1
              style={{
                fontSize: '28px',
                color: '#111827',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              🎉 You Are Invited to Interview 🎉
            </h1>
            <Img
              src='https://img.icons8.com/clouds/100/000000/handshake.png'
              width='125'
              height='120'
              alt='Handshake'
              style={{ margin: '0 auto 20px' }}
            />
            <Text>Dear {name},</Text>
            <Text
              style={{
                fontSize: '16px',
                color: '#374151',
                marginBottom: '24px',
              }}
            >
              Hi, {name}!. Thank you for participating in our internship
              recruitment. After did shortlist over candidates that applied in{' '}
              {batch} on {role} , you are one of the selected candidates that
              reach interview stage. Congrats!. Please come on time on the
              scheduled interview. If you have any problem regarding interview
              schedule, please reply this email!
            </Text>
          </Section>
        </div>
      </Tailwind>
    </Html>
  );
};

export default InterviewInvitationEmail;
