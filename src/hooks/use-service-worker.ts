import { useEffect, useState } from 'react';
import { clearInterval } from 'timers';
import { Workbox } from 'workbox-window';

let workbox: Workbox | null = null;
let updateCallback: () => void = () => window.location.reload();

type Props = {
  scriptUrl?: string;
  periodicUpdateInterval?: number;
};

export const useServiceWorker = (props?: Props): [boolean, () => void | null] => {
  const { scriptUrl = 'service-worker.js', periodicUpdateInterval } = props || {};
  const [isServiceWorkerUpdateAvailable, setServiceWorkerUpdateAvailable] = useState(false);

  useEffect(() => {
    let periodicUpdateHandler: NodeJS.Timeout | undefined;

    // Inspired by https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      workbox = new Workbox(scriptUrl);
      let registration: ServiceWorkerRegistration | undefined;

      updateCallback = () => {
        if (!workbox) {
          return;
        }

        // Assuming the user accepted the update, set up a listener
        // that will reload the page as soon as the previously waiting
        // service worker has taken control.
        workbox.addEventListener('controlling', () => {
          window.location.reload();
        });

        if (registration && registration.waiting) {
          // Send a message to the waiting service worker,
          // instructing it to activate.
          workbox.messageSW({ type: 'SKIP_WAITING' });
        }
      };

      // Add an event listener to detect when the registered
      // service worker has installed but is waiting to activate.
      workbox.addEventListener('waiting', () => setServiceWorkerUpdateAvailable(true));

      workbox.register().then((r) => {
        registration = r;

        // If a periodic update interval is set we manually check for service worker updates in this intervall
        // (otherwise only the browser would check for updates e.g. on page navigations)
        if (registration && periodicUpdateInterval) {
          periodicUpdateHandler = setInterval(() => registration?.update(), periodicUpdateInterval);
        }
      });
    }

    return () => {
      if (periodicUpdateHandler) {
        clearInterval(periodicUpdateHandler);
      }
    };
  }, []);

  return [isServiceWorkerUpdateAvailable, updateCallback];
};
