import { apiUrl } from './constants';

export const isAuthenticated = async () => {
  const response = await fetch(`${apiUrl}auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (response.status === 401 || !response.ok) {
    return false;
  } else {
    return true;
  }
};
