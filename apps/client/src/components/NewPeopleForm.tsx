import { useState } from 'react';
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
import { apiUrl } from '@/lib/constants';
import { useNavigate } from '@tanstack/react-router';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  video_url: z.string().url().optional().or(z.literal('')),
  wishlist_link: z.string().url({
    message: 'Please enter a valid URL for the wishlist.',
  }),
  type: z
    .enum(['children', 'elderly', 'special_needs'], {
      required_error: 'Please select a type.',
    })
    .optional(),
});

export function NewPeopleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      video_url: '',
      wishlist_link: '',
      type: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const res = await fetch(`${apiUrl}people`, {
        body: JSON.stringify(values),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to create');
    } catch (error) {
      console.error('Failed to update person', error);
    }

    setIsSubmitting(false);
    navigate({ to: '/' });
  }

  return (
    <div className="container mx-auto p-5 xl:p-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>Enter the person's full name.</FormDescription>
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
                  <Textarea
                    placeholder="Tell us about this person..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a brief description about the person.
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
                  <Input placeholder="https://example.com/video" {...field} />
                </FormControl>
                <FormDescription>
                  If available, enter a URL to a video about this person.
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
                  <Input
                    placeholder="https://example.com/wishlist"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the URL to this person's wishlist.
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
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="children">Children</SelectItem>
                    <SelectItem value="elderly">Elderly</SelectItem>
                    <SelectItem value="special_needs">Special Needs</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the category this person falls under.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
