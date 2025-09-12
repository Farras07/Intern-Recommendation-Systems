import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Your NextAuth options
import SessionWrapper from './SessionWrapper';

export default async function SessionProviderServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return <SessionWrapper session={session}>{children}</SessionWrapper>;
}
