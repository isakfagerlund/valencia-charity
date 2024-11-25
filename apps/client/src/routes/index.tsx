import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { PeopleSelect } from '../../../../models/people';

const fetchPeople = async () => {
  const res = await fetch('http://localhost:8787');
  if (!res.ok) throw new Error('Failed to fetch posts');

  const people = (await res.json()) as PeopleSelect[];
  return people;
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
  loader: fetchPeople,
});

function HomeComponent() {
  const data = useLoaderData({ from: '/' });

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      {data.map((person) => (
        <div key={person.id}>
          <p>{person.id}</p>
          <p>{person.name}</p>
          <p>{person.description}</p>
        </div>
      ))}
    </div>
  );
}
