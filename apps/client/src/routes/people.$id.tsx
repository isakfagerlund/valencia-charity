import {
  createFileRoute,
  notFound,
  useLoaderData,
} from '@tanstack/react-router';
import { PeopleSelect } from '../../../../models/people';

const apiUrl = import.meta.env.VITE_API_URL;

const fetchPerson = async (id: string) => {
  const res = await fetch(`${apiUrl}/people/${id}`);
  if (!res.ok) throw notFound();

  const person = (await res.json()) as PeopleSelect;
  return person;
};

export const Route = createFileRoute('/people/$id')({
  component: RouteComponent,
  loader: ({ params }) => fetchPerson(params.id),
});

function RouteComponent() {
  const data = useLoaderData({ from: '/people/$id' });

  return (
    <div>
      <p>{data.id}</p>
      <p>{data.name}</p>
      <p>{data.description}</p>
    </div>
  );
}
