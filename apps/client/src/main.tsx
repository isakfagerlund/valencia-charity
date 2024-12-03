import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './index.css';
import { KindeProvider } from '@kinde-oss/kinde-auth-react';

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: false,
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <KindeProvider
      clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
      domain="https://unboxingproject.kinde.com"
      redirectUri={import.meta.env.VITE_KINDE_REDIRECT_URI}
      logoutUri={import.meta.env.VITE_KINDE_LOGOUT_URI}
    >
      <RouterProvider router={router} />
    </KindeProvider>
  );
}
