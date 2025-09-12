import BaseError from '@/exceptions/BaseError';
import {
  useQuery as useRQQuery,
  useMutation as useRQMutation,
  useQueryClient,
} from '@tanstack/react-query';

type UseQueryTypes = {
  path: string;
  queryKey: (string | number | object)[];
  method?: 'POST' | 'PUT' | 'DELETE';
};

export function useQuery({ path, queryKey }: UseQueryTypes) {
  return useRQQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}${path}`);
      if (!res.ok) throw new BaseError(res.statusText, res.status);
      const json = await res.json();
      return json.data;
    },
  });
}

export function useMutation({ path, queryKey, method }: UseQueryTypes) {
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
    },
  });
}
