import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PeopleSelect } from '../../../../models/people';
import { apiUrl } from '@/lib/constants';
import { useNavigate } from '@tanstack/react-router';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  video_url: z.string().url().optional().or(z.literal('')),
  image_url: z.string().url().optional().or(z.literal('')),
  wishlist_link: z.string().url({
    message: 'Please enter a valid URL for the wishlist.',
  }),
  type: z
    .enum(['children', 'elderly', 'special_needs'], {
      required_error: 'Please select a type.',
    })
    .optional(),
});

export function EditPeopleForm({ personData }: { personData: PeopleSelect }) {
  const { getToken } = useKindeAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: personData.id,
      description: personData.description,
      video_url: personData.video_url ?? '',
      image_url: personData.image_url ?? '',
      wishlist_link: personData.wishlist_link,
      name: personData.name,
      type: personData.type ?? undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const accessToken = await getToken?.();

      const res = await fetch(`${apiUrl}people/${values.id}`, {
        body: JSON.stringify({ ...values, type: values.type ?? null }),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) throw new Error('Failed to update');

      navigate({ to: '/people/$id', params: { id: values.id.toString() } });
    } catch (error) {
      console.error('Failed to update person', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Edit the person's full name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Edit the description about the person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="video_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Edit the URL to a video about this person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wishlist_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wishlist Link</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Edit the URL to this person's wishlist.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="children">Children</SelectItem>
                  <SelectItem value="elderly">Elderly</SelectItem>
                  <SelectItem value="special_needs">Special Needs</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Edit the category this person falls under.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update'}
        </Button>
      </form>
    </Form>
  );
}
