import { Html } from '@react-email/html';
import { Tailwind } from '@react-email/tailwind';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Button } from '@react-email/button';
import { Img } from '@react-email/img';

type InterviewInviteEmailProps = {
  batch: string;
  role: string;
};

const InterviewInvitationEmailJudge: React.FC<InterviewInviteEmailProps> = ({
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
            <Text>Dear Judge,</Text>
            <Text
              style={{
                fontSize: '16px',
                color: '#374151',
                marginBottom: '24px',
              }}
            >
              You have been invited as judge to interview the candidate for
              recruitment {role} {batch}, please on time!
            </Text>
          </Section>
        </div>
      </Tailwind>
    </Html>
  );
};

export default InterviewInvitationEmailJudge;
