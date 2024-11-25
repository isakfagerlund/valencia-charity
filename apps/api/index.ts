import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from './src/db/db';
import { people } from './src/db/schema';

type Bindings = {
  TURSO_URL: string;
  TURSO_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.get('/', async (c) => {
  console.log();
  const allResults = await db({
    token: c.env.TURSO_TOKEN,
    url: c.env.TURSO_URL,
  })
    .select()
    .from(people);

  return c.body(JSON.stringify(allResults));
});

export default app;
