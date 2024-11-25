import * as React from 'react';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';

const fetchPeople = async () => {
  const res = await fetch('http://localhost:8787');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
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
      {data.map((person: unknown) => JSON.stringify(person))}
    </div>
  );
}
