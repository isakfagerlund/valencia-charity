import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const people = sqliteTable('people', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text().notNull(),
  main_image_key: text(),
  video_url: text(),
  wishlist_link: text().notNull(),
  type: text({ enum: ['children', 'elderly', 'special_needs'] }),
});
