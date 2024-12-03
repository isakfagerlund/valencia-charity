import { Hono } from 'hono';
import { Bindings } from '../index.js';
import { people } from './db/schema.js';
import { db } from './db/db.js';
import { zValidator } from '@hono/zod-validator';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { eq } from 'drizzle-orm';
import { jwt, type JwtVariables } from 'hono/jwt';
import { bearerAuth } from 'hono/bearer-auth';
import * as jose from 'jose';

const insertPeopleSchema = createInsertSchema(people);
const selectPeopleSchema = createSelectSchema(people);

type Variables = JwtVariables;

export const peopleRoute = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

peopleRoute.get('/', async (c) => {
  const allResults = await db({
    token: c.env.TURSO_TOKEN,
    url: c.env.TURSO_URL,
  })
    .select()
    .from(people);

  return c.body(JSON.stringify(allResults));
});

peopleRoute.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const foundPerson = await db({
    token: c.env.TURSO_TOKEN,
    url: c.env.TURSO_URL,
  }).query.people.findFirst({ where: eq(people.id, id) });

  if (foundPerson) {
    return c.body(JSON.stringify(foundPerson));
  } else {
    return c.body('Did not find the person', 404);
  }
});

peopleRoute.post(
  '/',
  zValidator('json', insertPeopleSchema, (result, c) => {
    console.log('data coming in', result.data);
    if (!result.success) {
      return c.text(
        `Invalid JSON: ${JSON.stringify(result.error.flatten().fieldErrors)}`,
        400
      );
    }
  }),
  async (c) => {
    const body = c.req.valid('json');

    await db({
      token: c.env.TURSO_TOKEN,
      url: c.env.TURSO_URL,
    })
      .insert(people)
      .values(body);

    return c.json({
      success: true,
      message: `Succefully added a new person ${body.name}`,
    });
  }
);

peopleRoute.put(
  '/:id',
  bearerAuth({
    async verifyToken(token, c) {
      const response = await fetch(
        'https://unboxingproject.kinde.com/.well-known/jwks'
      );
      const { keys } = await response.json();

      const rsaPublicKey = await jose.importJWK(keys[0]);
      try {
        const { payload } = await jose.jwtVerify(token, rsaPublicKey);
        console.log('Token is valid:', payload);
        return true;
      } catch (err) {
        console.error('Invalid token');
        return false;
      }
    },
  }),
  zValidator('json', selectPeopleSchema, (result, c) => {
    console.log('data coming in', result.data);

    if (!result.success) {
      return c.text(
        `Invalid JSON: ${JSON.stringify(result.error.flatten().fieldErrors)}`,
        400
      );
    }
  }),
  async (c) => {
    const body = c.req.valid('json');
    const payload = c.req.header('Authorization');

    console.log('Auth', payload);

    await db({
      token: c.env.TURSO_TOKEN,
      url: c.env.TURSO_URL,
    })
      .update(people)
      .set(body)
      .where(eq(people.id, body.id));

    return c.json({
      success: true,
      message: `Succefully edited ${body.name}`,
    });
  }
);

peopleRoute.delete('/', async (c) => c.text('DELETE /'));
