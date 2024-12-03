import { Toaster } from '@/components/ui/sonner';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { login, logout } = useKindeAuth();

  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>

        <Link
          to="/admin"
          activeProps={{
            className: 'font-bold',
          }}
        >
          Admin
        </Link>
        {/* @ts-ignore */}
        <button onClick={logout} type="button">
          Logout
        </button>
        {/* @ts-ignore */}
        <button onClick={login} type="button">
          Log In
        </button>
      </div>
      <hr />

      <div className="p-4 xl:p-6">
        <Outlet />
      </div>
      <Toaster richColors position="bottom-center" />
    </>
  );
}
