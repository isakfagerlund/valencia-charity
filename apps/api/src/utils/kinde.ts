import {
  createKindeServerClient,
  GrantType,
  SessionManager,
  UserType,
} from '@kinde-oss/kinde-typescript-sdk';
import { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { Bindings } from '../../index.js';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const allCookies = getCookie(c);
    console.log('all cookies', allCookies);
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    } as const;

    if (typeof value === 'string') {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value));
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ['id_token', 'access_token', 'user', 'refresh_token'].forEach((key) => {
      deleteCookie(c, key);
    });
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
  Bindings: Bindings;
  Variables: {
    user: UserType;
  };
};

export const getUser = createMiddleware<Env>(async (c, next) => {
  const client = await kindeClient(
    c.env.KINDE_DOMAIN,
    c.env.KINDE_CLIENT_ID,
    c.env.KINDE_SECRET,
    c.env.KINDE_SITE_URL,
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
