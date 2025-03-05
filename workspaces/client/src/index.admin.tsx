import ReactDOM from 'react-dom/client';

import { AdminApp } from '@wsh-2024/admin/src/index';

import { registerServiceWorker } from './utils/registerServiceWorker';

const main = async () => {
  await registerServiceWorker();

  const fn = () => {
    const root = document.getElementById('root');
    if (!root) throw new Error('Root element not found');
    ReactDOM.hydrateRoot(root, <AdminApp />);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};

main().catch(console.error);
