import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './index.css';
import { KindeProvider } from '@kinde-oss/kinde-auth-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PostHogProvider } from 'posthog-js/react';
import './i18n';

// Set up a Router instance
const router = createRouter({
  routeTree,
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app')!;

export const queryClient = new QueryClient();

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <PostHogProvider
      apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
      }}
    >
      <KindeProvider
        clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
        domain="https://auth.proyectounboxing.es"
        redirectUri={import.meta.env.VITE_KINDE_REDIRECT_URI}
        logoutUri={import.meta.env.VITE_KINDE_LOGOUT_URI}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </KindeProvider>
    </PostHogProvider>
  );
}
