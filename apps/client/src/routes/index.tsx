import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { PeopleSelect } from '../../../../models/people';
import { Card } from '@/components/ui/card';

const apiUrl = import.meta.env.VITE_API_URL;

const fetchPeople = async () => {
  const res = await fetch(`${apiUrl}/people`);
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
    <div className="flex flex-col gap-2 p-2">
      <h3>Welcome Home!</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((person) => (
          <Link className="w-full" key={person.id} to={`/people/${person.id}`}>
            <Card className="p-4">
              <img
                className="rounded pb-4"
                src="https://placehold.co/600x400"
              ></img>
              <p>{person.id}</p>
              <p>{person.name}</p>
              <p>{person.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
