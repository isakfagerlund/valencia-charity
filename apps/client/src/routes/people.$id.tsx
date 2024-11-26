import {
  createFileRoute,
  Link,
  notFound,
  useLoaderData,
} from '@tanstack/react-router';
import { fetchPerson } from '@/lib/fetchPerson';
import { Button } from '@/components/ui/button';

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
      <Link to="/people/$id/edit" params={{ id: data.id.toString() }}>
        <Button>Edit</Button>
      </Link>
    </div>
  );
}
