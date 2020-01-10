import { useEffect } from 'react';

export const useNativeBack = (backAction: () => void) => {
  useEffect(() => {
    const onPop = (event: Event) => {
      event.preventDefault();
      backAction();
    };

    addEventListener('popstate', onPop);

    return () => removeEventListener('popstate', onPop);
  }, []);

  return (route: Parameters<History['pushState']>[0]) => window.history.pushState(route, document.title);
};
