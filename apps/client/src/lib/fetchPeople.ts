import { PeopleSelect } from '../../../../models/people';
import { apiUrl } from './constants';

export const fetchPeople = async () => {
  const res = await fetch(`${apiUrl}people`);
  if (!res.ok) throw new Error('Failed to fetch posts');

  const people = (await res.json()) as PeopleSelect[];
  return people;
};
