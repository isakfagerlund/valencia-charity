import * as React from 'react';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { fetchPerson } from '@/lib/fetchPerson';
import { EditPeopleForm } from '@/components/EditPeopleForm';

export const Route = createFileRoute('/people_/$id/edit')({
  component: RouteComponent,
  loader: ({ params }) => fetchPerson(params.id),
});

function RouteComponent() {
  const data = useLoaderData({ from: '/people_/$id/edit' });

  return (
    <div>
      <EditPeopleForm personData={data} />
    </div>
  );
}
