import { Suspense, lazy, useEffect, useState } from 'react';
import App from './App.tsx';

// Admin is a separate, rarely-visited route - load it on demand so the public
// site bundle stays small and fast.
const Admin = lazy(() => import('./admin.tsx'));

const isAdminRoute = () =>
  window.location.pathname.startsWith('/admin');

export default function Root() {
  const [admin, setAdmin] = useState(isAdminRoute);

  useEffect(() => {
    const syncRoute = () => setAdmin(isAdminRoute());
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  return admin ? (
    <Suspense fallback={null}>
      <Admin />
    </Suspense>
  ) : (
    <App />
  );
}
