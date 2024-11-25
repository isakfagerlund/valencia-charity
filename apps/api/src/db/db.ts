import { drizzle } from 'drizzle-orm/libsql';

export const db = ({ token, url }: { token: string; url: string }) =>
  drizzle({
    connection: {
      url,
      authToken: token,
    },
  });
