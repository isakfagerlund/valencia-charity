import { Hono } from 'hono';
import { cors } from 'hono/cors';

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
app.use('/*', cors());

app.route('/people', peopleRoute);

export default app;
