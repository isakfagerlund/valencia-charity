import { Toaster } from '@/components/ui/sonner';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated, getPermission } = useKindeAuth();
  const hasAdminRole = getPermission?.('edit.access');

  return (
    <>
      {isAuthenticated && hasAdminRole?.isGranted && (
        <>
          <div className="p-2 flex gap-2 text-lg">
            <Link
              to="/"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
              viewTransition
            >
              Home
            </Link>

            <Link
              to="/admin"
              activeProps={{
                className: 'font-bold',
              }}
              viewTransition
            >
              Admin
            </Link>
          </div>
          <hr />
        </>
      )}

      <div className="p-4 xl:p-6">
        <Outlet />
      </div>
      <Toaster richColors position="bottom-center" />
    </>
  );
}
