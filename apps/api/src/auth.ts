import { Hono } from 'hono';
import { getUser, kindeClient, sessionManager } from './utils/kinde.js';
import { Bindings } from '../index.js';

export const authRoute = new Hono<{ Bindings: Bindings }>();

authRoute.get('/login', async (c) => {
  const client = await kindeClient(
    c.env.KINDE_DOMAIN,
    c.env.KINDE_CLIENT_ID,
    c.env.KINDE_SECRET,
    c.env.KINDE_SITE_URL,
    c.env.KINDE_POST_LOGOUT_REDIRECT_URL
  );

  const url = await client.login(sessionManager(c));

  console.log('URL here', url.toString());

  return c.redirect(url.toString());
});

authRoute.get('/logout', async (c) => {
  const client = await kindeClient(
    c.env.KINDE_DOMAIN,
    c.env.KINDE_CLIENT_ID,
    c.env.KINDE_SECRET,
    c.env.KINDE_SITE_URL,
    c.env.KINDE_POST_LOGOUT_REDIRECT_URL
  );

  const logoutUrl = await client.logout(sessionManager(c));
  console.log('logout url', logoutUrl.toString());
  return c.redirect(logoutUrl.toString());
});

authRoute.get('/callback', async (c) => {
  const url = new URL(c.req.url);
  const client = await kindeClient(
    c.env.KINDE_DOMAIN,
    c.env.KINDE_CLIENT_ID,
    c.env.KINDE_SECRET,
    c.env.KINDE_SITE_URL,
    c.env.KINDE_POST_LOGOUT_REDIRECT_URL
  );

  await client.handleRedirectToApp(sessionManager(c), url);

  return c.redirect(c.env.KINDE_POST_LOGOUT_REDIRECT_URL);
});

authRoute.get('/me', getUser, async (c) => {
  const user = c.var.user;
  return c.json({ user });
});
