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
});

app.get('images/:key', async (c) => {
  const key = c.req.param('key'); // File key from the URL
  const result = await c.env.UNBOXING_PROJECT_BUCKET.get(`images/${key}`);

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
