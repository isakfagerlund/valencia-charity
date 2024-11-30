import { apiUrl } from '@/lib/constants';
import { createFileRoute, redirect } from '@tanstack/react-router';

const isAuthenticated = async () => {
  const response = await fetch(`${apiUrl}auth/me`);

  if (response.status === 401 || !response.ok) {
    return false;
  } else {
    return true;
  }
};

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
