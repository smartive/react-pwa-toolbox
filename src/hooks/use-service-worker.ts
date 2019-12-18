import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

let workbox: Workbox | null = null;
let updateCallback: () => void = () => window.location.reload();

export const useServiceWorker = (
  scriptUrl = 'service-worker.js'
): [boolean, () => void | null] => {
  const [
    isServiceWorkerUpdateAvailable,
    setServiceWorkerUpdateAvailable
  ] = useState(false);

  useEffect(() => {
    if (
      'serviceWorker' in navigator &&
      process.env.NODE_ENV !== 'development'
    ) {
      workbox = new Workbox(scriptUrl);

      workbox.addEventListener('waiting', () =>
        setServiceWorkerUpdateAvailable(true)
      );

      updateCallback = () => {
        if (!workbox) {
          return;
        }

        workbox.addEventListener('controlling', () => {
          window.location.reload();
        });

        workbox.messageSW({ type: 'SKIP_WAITING' });
      };

      workbox
        .register()
        .then(
          registration =>
            !!registration.waiting && setServiceWorkerUpdateAvailable(true)
        );
    }
  }, []);

  return [isServiceWorkerUpdateAvailable, updateCallback];
};
