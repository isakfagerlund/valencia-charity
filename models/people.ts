import { people } from '../apps/api/src/db/schema.js';

export type PeopleSelect = typeof people.$inferSelect;
export type PeopleInsert = typeof people.$inferInsert;
