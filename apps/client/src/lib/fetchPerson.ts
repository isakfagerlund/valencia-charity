import { notFound } from '@tanstack/react-router';
import { PeopleSelect } from '../../../../models/people';
import { apiUrl } from './constants';

export const fetchPerson = async (id: string) => {
  const res = await fetch(`${apiUrl}people/${id}`);
  if (!res.ok) throw notFound();

  const person = (await res.json()) as PeopleSelect;
  return person;
};
