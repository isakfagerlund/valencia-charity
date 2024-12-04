import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { fetchPerson } from '@/lib/fetchPerson';
import { Button } from '@/components/ui/button';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { queryClient } from '@/main';
import { useSuspenseQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/people/$id')({
  component: RouteComponent,
  loader: ({ params }) =>
    queryClient.ensureQueryData({
      queryKey: ['person', params.id],
      queryFn: () => fetchPerson(params.id),
    }),
});

function RouteComponent() {
  const { id } = useParams({ from: '/people/$id' });
  const {
    data: { images, person },
  } = useSuspenseQuery({
    queryKey: ['person', id],
    queryFn: () => fetchPerson(id),
  });
  const { isAuthenticated } = useKindeAuth();

  return (
    <div className="flex flex-col gap-4 max-w-5xl m-auto">
      <div>
        {images.map((image) => (
          <img
            key={image}
            src={`${import.meta.env.VITE_API_URL}image/${image}`}
          ></img>
        ))}
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-2xl">{person.name}</p>
          <p>{person.description}</p>
        </div>
        <a href={person.wishlist_link}>Wishlist: {person.wishlist_link}</a>
      </div>

      {isAuthenticated && (
        <Link to="/people/$id/edit" params={{ id: person.id.toString() }}>
          <Button>Edit</Button>
        </Link>
      )}
    </div>
  );
}
