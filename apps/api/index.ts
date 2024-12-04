import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { nanoid } from 'nanoid';

import { peopleRoute } from './src/people.js';
import { bearerAuth } from 'hono/bearer-auth';
import { verifyToken } from './src/helpers/verifyToken.js';

export type Bindings = {
  TURSO_URL: string;
  TURSO_TOKEN: string;
  UNBOXING_PROJECT_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());

app.post(
  'images/:personId',
  bearerAuth({
    verifyToken,
  }),
  async (c) => {
    const personId = c.req.param('personId');
    const key = nanoid(10);
    const formData = await c.req.parseBody();
    const file = formData['file'];
    if (file instanceof File) {
      const fileBuffer = await file.arrayBuffer();
      const fullName = file.name;
      const ext = fullName.split('.').pop();
      const path = `images/${personId}/${key}.${ext}`;

      try {
        const uploadedFile = await c.env.UNBOXING_PROJECT_BUCKET.put(
          path,
          fileBuffer
        );

        return c.json({ key: uploadedFile?.key });
      } catch (error) {
        console.log(error);
        return c.json({ message: 'Something went wrong' });
      }
    } else {
      return c.text('Invalid file', 400);
    }
  }
);

app.get('images/:personId', async (c) => {
  const personId = c.req.param('personId');
  const result = await c.env.UNBOXING_PROJECT_BUCKET.list({
    prefix: `images/${personId}/`,
  });
  const keys = result.objects.map((obj) => obj.key);

  return c.json(keys);
});

app.delete(
  'images/:personId/:key',
  bearerAuth({
    verifyToken,
  }),
  async (c) => {
    const personId = c.req.param('personId');
    const key = c.req.param('key');

    try {
      await c.env.UNBOXING_PROJECT_BUCKET.delete(`images/${personId}/${key}`);

      return c.json({ message: 'success' });
    } catch (error) {
      return c.status(404);
    }
  }
);

app.get('image/:folder/:personId/:key', async (c) => {
  const folder = c.req.param('folder');
  const personId = c.req.param('personId');
  const key = c.req.param('key');
  const result = await c.env.UNBOXING_PROJECT_BUCKET.get(
    `${folder}/${personId}/${key}`
  );

  if (result && result.httpMetadata) {
    return c.body(result.body, 200, {
      'content-type': result.httpMetadata.contentType || 'image/jpeg',
    });
  } else {
    return c.text('Image not found', 404);
  }
});

app.route('/people', peopleRoute);

export default app;
