import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

export const db = ({ token, url }: { token: string; url: string }) =>
  drizzle({
    schema,
    connection: {
      url,
      authToken: token,
    },
  });
