import { NewPeopleForm } from '@/components/NewPeopleForm';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated, getPermission } = useKindeAuth();
  const hasAdminRole = getPermission?.('edit.access');

  if (!isAuthenticated || !hasAdminRole?.isGranted) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <h3 className="text-3xl py-6">Add a new person</h3>
      <NewPeopleForm />
    </div>
  );
}
