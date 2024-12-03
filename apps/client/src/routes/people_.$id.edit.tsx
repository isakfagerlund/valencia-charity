import {
  createFileRoute,
  Navigate,
  redirect,
  useLoaderData,
} from '@tanstack/react-router';
import { fetchPerson } from '@/lib/fetchPerson';
import { EditPeopleForm } from '@/components/EditPeopleForm';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

export const Route = createFileRoute('/people_/$id/edit')({
  component: RouteComponent,
  loader: ({ params }) => fetchPerson(params.id),
});

function RouteComponent() {
  const { isAuthenticated } = useKindeAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const data = useLoaderData({ from: '/people_/$id/edit' });

  return (
    <div>
      <h3 className="text-3xl py-6">Edit {data.name}</h3>
      <EditPeopleForm personData={data} />
    </div>
  );
}
