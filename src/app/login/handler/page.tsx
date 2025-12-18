'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import _Fetch from '@/hooks/request.hooks';
import { useSearchParams } from 'next/navigation';
import Typography from '@/components/Typography';
import NotFoundError from '@/exceptions/NotFoundError';
import { DANGER_TOAST, showToast } from '@/components/Toast';
import BaseError from '@/exceptions/BaseError';

export default function LoginHandlerPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<any>({
    isLoading: true,
    message: 'Verified your Account...',
  });

  useEffect(() => {
    try {
      if (session) {
        const fetchData = async () => {
          try {
            const userData = await _Fetch(
              `/user?email=${session?.user.email}`,
              'GET',
            );
            if (userData.verified) {
              setLoading({
                isLoading: true,
                message: `Login as ${session.user.email}`,
              });
              if (!userData.image && !userData.name) {
                await _Fetch(`/user?id=${userData.id}`, 'PUT', {
                  image: session.user.image,
                  name: session.user.name,
                });
              }
              setTimeout(() => {
                router.push('/dashboard');
              }, 3000);
            }
            if (!userData.verified)
              setLoading({
                isLoading: false,
                message: 'Ask Admin to Verify Your Account',
              });
          } catch (error: any) {
            if (error instanceof NotFoundError) {
              const role = searchParams.get('role');
              const payload = {
                ...session.user,
                role,
                verified: false,
              };
              const a = await _Fetch('/user', 'POST', payload);
              if (a.id) {
                setLoading({
                  isLoading: false,
                  message: `Ask Admin to Verify Your Account`,
                });
              }
            }
          }
        };
        fetchData();
      }
    } catch (err: any) {
      if (err instanceof BaseError) showToast(err.message, DANGER_TOAST);
      showToast(err, DANGER_TOAST);
    }
  }, [session, router, searchParams]);

  // View Component Page LoginHandler
  return (
    <div className='flex items-center justify-center h-screen gap-7'>
      <div
        className={`${loading.isLoading ? 'animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900' : 'hidden'}`}
      ></div>
      <Typography variant='h6' color='dark'>
        {loading.message}
      </Typography>
    </div>
  );
}
