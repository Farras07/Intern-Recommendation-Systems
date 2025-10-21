'use client';
import { ModalProvider } from '@faceless-ui/modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/lib/redux/store';

import Toast from '@/components/Toast';

// const defaultQueryFn = async ({ queryKey }: QueryOptions) => {
//   const { data } = await api.get(`${queryKey?.[0]}`);
//   return data;
// };

const queryClient = new QueryClient();

// function ReactQueryProvider({ children }: { children: ReactNode }) {
//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// }

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <Toast />
          <ModalProvider transTime={250}>{children}</ModalProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </Provider>
  );
};

export default Providers;
