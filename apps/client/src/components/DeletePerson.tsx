import { useMutation } from '@tanstack/react-query';
import { PeopleSelect } from '../../../../models/people';
import { Button } from './ui/button';
import { apiUrl } from '@/lib/constants';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { queryClient } from '@/main';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export const DeletePerson = ({ person }: { person: PeopleSelect }) => {
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationKey: ['person', person.id.toString()],
    mutationFn: async () => {
      try {
        const accessToken = await getToken?.();

        await fetch(`${apiUrl}people/${person.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        toast.error('Error when deleting');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['people'],
      });
      navigate({ to: '/' });
    },
    onError: () => {
      toast.error('Error when deleting person');
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-6" variant="destructive">
          Delete Person
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this person from our servers?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => mutate()} variant="destructive" type="submit">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
