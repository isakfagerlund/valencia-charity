import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { nanoid } from 'nanoid';

import { peopleRoute } from './src/people.js';

export type Bindings = {
  TURSO_URL: string;
  TURSO_TOKEN: string;
  UNBOXING_PROJECT_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.post('/upload', async (c) => {
  const key = nanoid(10);
  const formData = await c.req.parseBody();
  const file = formData['file'];
  if (file instanceof File) {
    const fileBuffer = await file.arrayBuffer();
    const fullName = file.name;
    const ext = fullName.split('.').pop();
    const path = `images/${key}.${ext}`;

    try {
      console.log(c.env.UNBOXING_PROJECT_BUCKET);
      await c.env.UNBOXING_PROJECT_BUCKET.put(path, fileBuffer);
      return c.json({ message: `Put ${key} successfully!` });
    } catch (error) {
      console.log(error);
      return c.json({ message: 'Something went wrong' });
    }
  } else {
    return c.text('Invalid file', 400);
  }
});

app.get('images/:key', async (c) => {
  const key = c.req.param('key');
  console.log(key);
  const object = await c.env.UNBOXING_PROJECT_BUCKET.get(key);

  if (object === null) {
    return new Response('Object Not Found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body, {
    headers,
  });
});

app.route('/people', peopleRoute);

export default app;
