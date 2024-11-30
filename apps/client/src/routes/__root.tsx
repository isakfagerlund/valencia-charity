import { Toaster } from '@/components/ui/sonner';
import { isAuthenticated } from '@/lib/checkIsAuthenticated';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  beforeLoad: async () => {
    try {
      const isAuthed = await isAuthenticated();
      return { isAuthed };
    } catch (e) {
      return { isAuthed: false };
    }
  },
  component: RootComponent,
});

function RootComponent() {
  const { isAuthed } = Route.useRouteContext();

  return (
    <>
      {isAuthed && (
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
