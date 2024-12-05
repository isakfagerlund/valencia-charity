import { ChangeEvent, useRef, useState } from 'react';
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
import { toast } from 'sonner';
import { Label } from './ui/label';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/main';

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  video_url: z.string().url().optional().or(z.literal('')),
  main_image_key: z.string().optional().or(z.literal('')),
  wishlist_link: z.string().url({
    message: 'Please enter a valid URL for the wishlist.',
  }),
  type: z
    .enum(['children', 'elderly', 'special_needs'], {
      required_error: 'Please select a type.',
    })
    .optional(),
});

export function EditPeopleForm({
  personData,
  images,
}: {
  personData: PeopleSelect;
  images: string[];
}) {
  const { getToken } = useKindeAuth();
  const navigate = useNavigate();
  const imageUploadRef = useRef<HTMLInputElement | null>(null);

  const { mutate: onSubmitMutate, status: onSubmitStatus } = useMutation({
    mutationKey: ['person', personData.id.toString()],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
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

      return values;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['person', personData.id.toString()],
      });
      navigate({ to: '/people/$id', params: { id: data.id.toString() } });
    },
    onError: () => {
      toast.error('Error when submitting form');
    },
  });

  const { mutate: onImageDeleteMutate } = useMutation({
    mutationKey: ['person', personData.id.toString()],
    mutationFn: async (key: string) => {
      try {
        const accessToken = await getToken?.();

        await fetch(`${apiUrl}${key}`, {
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
        queryKey: ['person', personData.id.toString()],
      });
    },
    onError: () => {
      toast.error('Error when deleting image');
    },
  });

  const { mutate: onImageUploadMutate } = useMutation({
    mutationKey: ['person', personData.id.toString()],
    mutationFn: async (event: ChangeEvent<HTMLInputElement>) => {
      if (event?.target?.files?.[0]) {
        const file = event?.target?.files?.[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
          const accessToken = await getToken?.();

          const res = await fetch(`${apiUrl}images/${personData.id}`, {
            body: formData,
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!res.ok) throw new Error('Failed to upload');
        } catch (error) {
          toast.error('Error when uploading file');
        }

        if (imageUploadRef.current) {
          imageUploadRef.current.value = '';
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['person', personData.id.toString()],
      });
    },
    onError: () => {
      toast.error('Error when uploading image');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: personData.id,
      description: personData.description,
      video_url: personData.video_url ?? '',
      main_image_key: personData.main_image_key ?? '',
      wishlist_link: personData.wishlist_link,
      name: personData.name,
      type: personData.type ?? undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onSubmitMutate(values);
  }

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {images.map((image) => (
          <Card key={image} className="overflow-hidden">
            <CardContent className="p-0 relative group">
              <div className="aspect-video relative">
                <img
                  src={`${import.meta.env.VITE_API_URL}image/${image}`}
                  alt={`Uploaded image ${image}`}
                  className="object-cover aspect-video"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onImageDeleteMutate(image)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="pt-6 flex flex-col gap-4 justify-center ">
              <p className="font-bold">
                {form.watch('main_image_key') === image &&
                  'This is the current set image ✅'}
              </p>
              <Button
                onClick={() => {
                  form.setValue('main_image_key', image);
                  form.trigger('main_image_key');
                }}
              >
                Make main image
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mb-8 flex flex-col gap-4">
        <Label>Upload images</Label>
        <Input
          ref={imageUploadRef}
          onChange={onImageUploadMutate}
          type="file"
          accept="image/*"
        />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="main_image_key"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
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
        <Button type="submit" disabled={onSubmitStatus === 'pending'}>
          {onSubmitStatus === 'pending' ? 'Updating...' : 'Update'}
        </Button>
      </form>
    </Form>
  );
}
