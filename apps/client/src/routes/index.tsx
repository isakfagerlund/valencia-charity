import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { PeopleSelect } from '../../../../models/people';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
    <div className="flex flex-col gap-2 p-2">
      <h3>Welcome Home!</h3>
      <Button>Click me</Button>
      {data.map((person) => (
        <Card className="p-2" key={person.id}>
          <p>{person.id}</p>
          <p>{person.name}</p>
          <p>{person.description}</p>
        </Card>
      ))}
    </div>
  );
}
