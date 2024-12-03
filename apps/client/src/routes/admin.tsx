import { NewPeopleForm } from '@/components/NewPeopleForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h3 className="text-3xl py-6">Add a new person</h3>
      <NewPeopleForm />
    </div>
  );
}
