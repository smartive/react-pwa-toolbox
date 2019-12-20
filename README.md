# react-pwa-toolbox
Toolbox containing various helpers for creating PWA's with React.
These helpers use themselves Google Workbox (https://github.com/GoogleChrome/workbox).

## useServiceWorker hook

This React hook can be used to register a service worker by providing the path to a service-worker file.

It will also return a boolean value indicating if a new service-worker is available to be installed and a callback which can be called to force the installation of the updated service-worker.

```tsx
import { useServiceWorker } from '@smartive/react-pwa-toolbox';

const [updateAvailable, installUpdate] = useServiceWorker('service-worker.js');

{updateAvailable && (
    <UpdateBanner
        message="New Update available!"
        buttonLabel="Install"
        onUpdate={installUpdate}
    />
)}
```