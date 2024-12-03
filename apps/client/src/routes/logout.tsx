import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

export const Route = createFileRoute('/logout')({
  component: RouteComponent,
});

function RouteComponent() {
  const { logout } = useKindeAuth();

  return (
    // @ts-ignore
    <Button onClick={logout}>Logout!</Button>
  );
}
