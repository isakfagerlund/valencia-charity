import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { apiUrl } from '@/lib/constants';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Button asChild>
      <a href={`${apiUrl}auth/login`}>Login!</a>
    </Button>
  );
}
