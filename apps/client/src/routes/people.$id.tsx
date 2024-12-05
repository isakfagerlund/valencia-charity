import {
  createFileRoute,
  Link,
  useParams,
  useRouter,
} from '@tanstack/react-router';
import { fetchPerson } from '@/lib/fetchPerson';
import { Button } from '@/components/ui/button';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { queryClient } from '@/main';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ChevronLeft, PencilIcon } from 'lucide-react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export const Route = createFileRoute('/people/$id')({
  component: RouteComponent,
  loader: ({ params }) =>
    queryClient.ensureQueryData({
      queryKey: ['person', params.id],
      queryFn: () => fetchPerson(params.id),
    }),
});

function RouteComponent() {
  const { id } = useParams({ from: '/people/$id' });
  const {
    data: { images, person },
  } = useSuspenseQuery({
    queryKey: ['person', id],
    queryFn: () => fetchPerson(id),
  });
  const { isAuthenticated } = useKindeAuth();
  const { history } = useRouter();

  return (
    <div className="flex flex-col gap-4 max-w-5xl m-auto">
      <div>
        <Button size="icon" variant="ghost" onClick={() => history.go(-1)}>
          <ChevronLeft />
        </Button>
      </div>
      <PhotoProvider>
        <div>
          <PhotoView
            src={`${import.meta.env.VITE_API_URL}image/${person.main_image_key}`}
          >
            <img
              className="rounded aspect-video object-cover w-full"
              src={`${import.meta.env.VITE_API_URL}image/${person.main_image_key}`}
            ></img>
          </PhotoView>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {images.map((image) => {
            if (image === person.main_image_key) {
              return null;
            }

            return (
              <PhotoView
                key={image}
                src={`${import.meta.env.VITE_API_URL}image/${image}`}
              >
                <img
                  className="rounded 1/3 aspect-video object-cover"
                  src={`${import.meta.env.VITE_API_URL}image/${image}`}
                ></img>
              </PhotoView>
            );
          })}
        </div>
      </PhotoProvider>
      <div className="flex justify-between">
        <div className="w-full">
          <p className="text-2xl">{person.name}</p>
          <div className="flex flex-col md:flex-row gap-8">
            <p className="w-full md:w-2/3">{person.description}</p>
            <Button className="w-1/3">
              <a href={person.wishlist_link}>Wishlist Link</a>
            </Button>
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <Link
          className="absolute right-4 top-16"
          to="/people/$id/edit"
          params={{ id: person.id.toString() }}
        >
          <Button size="icon" variant="outline">
            <PencilIcon />
          </Button>
        </Link>
      )}
    </div>
  );
}
