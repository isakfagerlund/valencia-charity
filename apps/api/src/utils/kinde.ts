import {
  createKindeServerClient,
  GrantType,
  SessionManager,
  UserType,
} from '@kinde-oss/kinde-typescript-sdk';
import { Context } from 'hono';
import { createMiddleware } from 'hono/factory';

let store: Record<string, unknown> = {};

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    return store[key];
  },
  async setSessionItem(key: string, value: unknown) {
    store[key] = value;
  },
  async removeSessionItem(key: string) {
    delete store[key];
  },
  async destroySession() {
    store = {};
  },
});

export const kindeClient = async (
  domain: string,
  id: string,
  secret: string,
  redirectURL: string,
  logoutRedirectURL: string
) =>
  createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
    authDomain: domain,
    clientId: id,
    clientSecret: secret,
    redirectURL: redirectURL,
    logoutRedirectURL: logoutRedirectURL,
  });
type Env = {
  Variables: {
    user: UserType;
  };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
  const client = await kindeClient(
    // @ts-ignore
    c.env.KINDE_DOMAIN,
    // @ts-ignore
    c.env.KINDE_CLIENT_ID,
    // @ts-ignore

    c.env.KINDE_SECRET,
    // @ts-ignore

    c.env.KINDE_SITE_URL,
    // @ts-ignore

    c.env.KINDE_POST_LOGOUT_REDIRECT_URL
  );

  try {
    const manager = sessionManager(c);
    const isAuthenticated = await client.isAuthenticated(manager);
    if (!isAuthenticated) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const user = await client.getUserProfile(manager);
    c.set('user', user);
    await next();
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Unauthorized' }, 401);
  }
});
