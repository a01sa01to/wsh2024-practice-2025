import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';

import { AdminApp } from '@wsh-2024/admin/src/index';

import { registerServiceWorker } from './utils/registerServiceWorker';

const main = async () => {
  await registerServiceWorker();

  const fn = () => {
    const root = document.getElementById('root');
    if (!root) throw new Error('Root element not found');
    const injectData = JSON.parse(document.getElementById('inject-data')?.textContent ?? '{}');
    const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } });
    ReactDOM.hydrateRoot(
      root,
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={injectData}>
          <AdminApp />
        </HydrationBoundary>
      </QueryClientProvider>,
    );
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};

main().catch(console.error);
