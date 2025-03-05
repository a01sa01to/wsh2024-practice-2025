import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { ClientApp } from '@wsh-2024/app/src/index';

import { registerServiceWorker } from './utils/registerServiceWorker';

const main = async () => {
  await registerServiceWorker();

  const fn = () => {
    const root = document.getElementById('root');
    if (!root) throw new Error('Root element not found');
    const injectData = JSON.parse(document.getElementById('inject-data')?.textContent ?? '{}');
    ReactDOM.hydrateRoot(
      root,
      <SWRConfig
        value={{
          fallback: injectData,
          provider: () => new Map(),
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        }}
      >
        <BrowserRouter>
          <ClientApp />
        </BrowserRouter>
      </SWRConfig>,
    );
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};

main().catch(console.error);
