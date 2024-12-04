import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchPeople } from '@/lib/fetchPeople';
import { FileImage } from 'lucide-react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { queryClient } from '@/main';

const peopleQueryOptions = queryOptions({
  queryKey: ['people'],
  queryFn: () => fetchPeople(),
});

export const Route = createFileRoute('/')({
  component: HomeComponent,
  loader: () => queryClient.ensureQueryData(peopleQueryOptions),
});

function HomeComponent() {
  const { data } = useSuspenseQuery(peopleQueryOptions);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="pb-4">
        <img className="w-full max-w-[200px]" src="/logo.png"></img>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((person) => (
          <Link className="w-full" key={person.id} to={`/people/${person.id}`}>
            <Card className="p-4">
              {person.main_image_key ? (
                <img
                  className="rounded aspect-video object-cover"
                  src={`${import.meta.env.VITE_API_URL}image/${person.main_image_key}`}
                ></img>
              ) : (
                <div className="rounded bg-zinc-300 aspect-video text-zinc-600 flex justify-center items-center gap-4">
                  <p>No image</p>
                  <FileImage />
                </div>
              )}

              <div className="flex pt-4 justify-between">
                <div>
                  <p className="font-semibold">{person.name}</p>
                  <p>{person.description}</p>
                </div>
                {person.type && <Badge className="h-6">{person.type}</Badge>}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
