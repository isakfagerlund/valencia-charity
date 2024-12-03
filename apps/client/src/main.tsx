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
      audience="http://localhost:8787"
      clientId="5581cb4d32994d64bda55a8bf027ed34"
      domain="https://unboxingproject.kinde.com"
      redirectUri="http://localhost:3001"
      logoutUri="http://localhost:3001"
    >
      <RouterProvider router={router} />
    </KindeProvider>
  );
}
