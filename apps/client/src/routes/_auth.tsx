import { isAuthenticated } from '@/lib/checkIsAuthenticated';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ location }) => {
    const isAuthed = await isAuthenticated();

    if (!isAuthed) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
