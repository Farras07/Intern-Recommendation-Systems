import AuthenticationError from '@/exceptions/AuthenticationError';
import AuthorizationError from '@/exceptions/AuthorizationError';
import BaseError from '@/exceptions/BaseError';
import NotFoundError from '@/exceptions/NotFoundError';

const _Fetch = async (
  path: string,
  method: string,
  body?: any,
  signal?: AbortSignal,
) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASEURL}${path}`;
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
      signal,
    };

    if (method !== 'GET' && body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);
    const resBody = await res.json().catch(() => ({}));

    if (!res.ok) {
      switch (res.status) {
        case 400:
          throw new BaseError(resBody.message || 'Bad Request', 400);
        case 401:
          throw new AuthenticationError(resBody.message || 'Unauthorized');
        case 403:
          throw new AuthorizationError(resBody.message || 'Forbidden');
        case 404:
          throw new NotFoundError(resBody.message || 'Not Found');
        default:
          throw new BaseError(resBody.message || res.statusText, res.status);
      }
    }

    return resBody.data ?? resBody;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new BaseError('Request timed out', 408);
    }
    throw error;
  }
};

export default _Fetch;
