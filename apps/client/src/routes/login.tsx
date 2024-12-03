import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const { login } = useKindeAuth();

  return (
    // @ts-ignore
    <Button onClick={login}>Login!</Button>
  );
}
