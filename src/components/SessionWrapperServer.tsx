import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import SessionWrapper from './SessionWrapper';

export default async function SessionProviderServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return <SessionWrapper session={session}>{children}</SessionWrapper>;
}
