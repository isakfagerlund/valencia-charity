import { notFound } from '@tanstack/react-router';
import { PeopleSelect } from '../../../../models/people';
import { apiUrl } from './constants';

const fetchImages = async (id: string) => {
  const res = await fetch(`${apiUrl}images/${id}`);
  if (!res.ok) throw notFound();

  const person = (await res.json()) as Array<string>;
  return person;
};

export const fetchPerson = async (id: string) => {
  const res = await fetch(`${apiUrl}people/${id}`);
  const imagesRes = await fetchImages(id);
  if (!res.ok) throw notFound();

  const person = (await res.json()) as PeopleSelect;
  return { person, images: imagesRes };
};
