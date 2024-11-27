import { NewPeopleForm } from '@/components/NewPeopleForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <NewPeopleForm />
    </div>
  );
}
