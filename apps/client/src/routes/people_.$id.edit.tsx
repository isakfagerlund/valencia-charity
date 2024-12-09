import { createFileRoute, Navigate, useParams } from '@tanstack/react-router';
import { fetchPerson } from '@/lib/fetchPerson';
import { EditPeopleForm } from '@/components/EditPeopleForm';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { queryClient } from '@/main';
import { useSuspenseQuery } from '@tanstack/react-query';
import { DeletePerson } from '@/components/DeletePerson';

export const Route = createFileRoute('/people_/$id/edit')({
  component: RouteComponent,
  loader: ({ params }) =>
    queryClient.ensureQueryData({
      queryKey: ['person', params.id],
      queryFn: () => fetchPerson(params.id),
    }),
});

function RouteComponent() {
  const { isAuthenticated, getPermission } = useKindeAuth();
  const hasAdminRole = getPermission?.('edit.access');

  if (!isAuthenticated || !hasAdminRole?.isGranted) {
    return <Navigate to="/" />;
  }

  const { id } = useParams({ from: '/people_/$id/edit' });
  const {
    data: { images, person },
  } = useSuspenseQuery({
    queryKey: ['person', id],
    queryFn: () => fetchPerson(id),
  });

  return (
    <div>
      <h3 className="text-3xl py-6">Edit {person.name}</h3>
      <EditPeopleForm personData={person} images={images} />
      <DeletePerson person={person} />
    </div>
  );
}
