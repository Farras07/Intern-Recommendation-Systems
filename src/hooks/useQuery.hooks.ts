import BaseError from '@/exceptions/BaseError';
import {
  useQuery as useRQQuery,
  useMutation as useRQMutation,
  useQueryClient,
} from '@tanstack/react-query';
import _Fetch from './request.hooks';
import { DANGER_TOAST, SUCCESS_TOAST, showToast } from '@/components/Toast';

type UseQueryTypes = {
  path: string;
  queryKey: (string | number | object)[];
  method?: 'POST' | 'PUT' | 'DELETE';
  enabledVar?: any;
  timeout?: number;
  errorMessage?: string;
  successMessage?: string;
};

export function useQuery({
  path,
  queryKey,
  enabledVar,
  timeout = 20000,
}: UseQueryTypes) {
  return useRQQuery({
    queryKey,
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await _Fetch(
          path,
          'GET',
          undefined,
          controller.signal,
        );
        return response;
      } catch (err) {
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    enabled: enabledVar,
  });
}

export function useMutation({
  path,
  queryKey,
  method,
  errorMessage = 'Request Failed: ',
  successMessage = 'Request Success',
}: UseQueryTypes) {
  const queryClient = useQueryClient();

  return useRQMutation({
    mutationFn: async (body: any) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new BaseError(res.statusText, res.status);
      return res.json();
    },
    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: queryKey });
      }
      showToast(successMessage, SUCCESS_TOAST);
    },
    onError: error => {
      showToast(`${errorMessage} : ${error.message}`, DANGER_TOAST);
    },
  });
}
