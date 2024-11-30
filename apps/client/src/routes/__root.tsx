import { Toaster } from '@/components/ui/sonner';
import { apiUrl } from '@/lib/constants';
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

const isAuthenticated = async () => {
  const response = await fetch(`${apiUrl}auth/me`);

  if (response.status === 401 || !response.ok) {
    return false;
  } else {
    return true;
  }
};

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
