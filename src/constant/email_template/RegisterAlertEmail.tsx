import { Html } from '@react-email/html';
import { Tailwind } from '@react-email/tailwind';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Button } from '@react-email/button';
import { Img } from '@react-email/img';

type RegisterAlertEmailProps = {
  name: string;
};

const RegisterAlertEmail: React.FC<RegisterAlertEmailProps> = ({ name }) => {
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
              textAlign: 'center',
              boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
            }}
          >
            <h1
              style={{
                fontSize: '28px',
                color: '#111827',
                fontWeight: 'bold',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              🎉 Thankyou for submit your application 🎉
            </h1>
            <Img
              src='https://img.icons8.com/clouds/100/000000/handshake.png'
              width='125'
              height='120'
              alt='Handshake'
              style={{ margin: '0 auto 20px' }}
            />
            <Text
              style={{
                fontSize: '16px',
                color: '#374151',
                marginBottom: '24px',
              }}
            >
              Hi, {name}!. Thank you for participating in our internship
              recruitment. We will select candidates shortly after registration
              phase closes. Please check your email periodically, we will send
              all information via email including selection result.
            </Text>
            <Button
              href='http://localhost:3000/login'
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Login
            </Button>
          </Section>
        </div>
      </Tailwind>
    </Html>
  );
};

export default RegisterAlertEmail;
