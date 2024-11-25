import { people } from '../apps/api/src/db/schema';

export type PeopleSelect = typeof people.$inferSelect;
export type PeopleInsert = typeof people.$inferInsert;
