import { createFileRoute } from '@tanstack/react-router';
import { fetchPeople } from '@/lib/fetchPeople';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { queryClient } from '@/main';
import { PeopleList } from '@/components/PeopleList';

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
    <div className="flex flex-col gap-2">
      <div className="pb-4">
        <img className="w-full max-w-[200px]" src="/logo.png"></img>
      </div>
      <PeopleList data={data} />
    </div>
  );
}
