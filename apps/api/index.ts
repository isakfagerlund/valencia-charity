import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { authRoute } from './src/auth.js';
import { peopleRoute } from './src/people.js';

export type Bindings = {
  TURSO_URL: string;
  TURSO_TOKEN: string;
  KINDE_DOMAIN: string;
  KINDE_CLIENT_ID: string;
  KINDE_SECRET: string;
  KINDE_SITE_URL: string;
  KINDE_POST_LOGOUT_REDIRECT_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use(
  '/*',
  cors({
    origin: ['http://localhost:3001', 'https://valencia-charity.pages.dev'],
    credentials: true,
  })
);

app.route('/auth', authRoute);
app.route('/people', peopleRoute);

export default app;
