import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { PeopleSelect } from '../../../../models/people';
import { Card } from '@/components/ui/card';
import { apiUrl } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

const fetchPeople = async () => {
  const res = await fetch(`${apiUrl}people`);
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
      <div className="pb-4">
        <img className="w-full max-w-[250px]" src="/logo.png"></img>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((person) => (
          <Link className="w-full" key={person.id} to={`/people/${person.id}`}>
            <Card className="p-4">
              <img
                className="rounded pb-4"
                src="https://placehold.co/600x400"
              ></img>
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{person.name}</p>
                  <p>{person.description}</p>
                </div>
                {person.type && <Badge className="h-6">{person.type}</Badge>}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
