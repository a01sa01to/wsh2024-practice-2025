import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { AdminApp } from '@wsh-2024/admin/src/index';
import { ClientApp } from '@wsh-2024/app/src/index';

import { registerServiceWorker } from './utils/registerServiceWorker';

const main = async () => {
  await registerServiceWorker();

  const fn = () => {
    const root = document.getElementById('root');
    if (!root) throw new Error('Root element not found');
    if (window.location.pathname.startsWith('/admin')) {
      ReactDOM.createRoot(root).render(<AdminApp />);
    } else {
      ReactDOM.hydrateRoot(
        root,
        <SWRConfig value={{ revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false }}>
          <BrowserRouter>
            <ClientApp />
          </BrowserRouter>
        </SWRConfig>,
      );
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};

main().catch(console.error);
