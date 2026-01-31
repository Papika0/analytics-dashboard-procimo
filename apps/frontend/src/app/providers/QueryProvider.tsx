import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0, // No caching - data removed immediately when unused
      refetchOnWindowFocus: false,
      retry: 1,
      // To enable frontend caching, uncomment below and comment out gcTime: 0 above:
      // gcTime: 1000 * 60 * 5, // 5 minutes - keeps data in memory for deduplication
      // staleTime: 1000 * 60, // 1 minute - data considered fresh, won't refetch
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
