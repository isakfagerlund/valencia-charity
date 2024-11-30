import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Button asChild>
      <a href="/api/auth/login">Login!</a>
    </Button>
  );
}
