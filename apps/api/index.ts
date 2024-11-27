import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from './src/db/db.js';
import { people } from './src/db/schema.js';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

type Bindings = {
  TURSO_URL: string;
  TURSO_TOKEN: string;
};

const insertPeopleSchema = createInsertSchema(people);
const selectPeopleSchema = createSelectSchema(people);

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/people', async (c) => {
  const allResults = await db({
    token: c.env.TURSO_TOKEN,
    url: c.env.TURSO_URL,
  })
    .select()
    .from(people);

  return c.body(JSON.stringify(allResults));
});

app.get('/people/:id', async (c) => {
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

app.post(
  '/people',
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

app.put(
  '/people/:id',
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

app.delete('/people', async (c) => c.text('DELETE /'));

export default app;
