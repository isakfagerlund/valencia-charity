import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/logout')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Button asChild>
      <a href="/api/auth/logout">Logout!</a>
    </Button>
  );
}
