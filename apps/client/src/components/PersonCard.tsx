import { Link } from '@tanstack/react-router';
import { Card } from './ui/card';
import { PeopleSelect } from '../../../../models/people';
import { FileImage } from 'lucide-react';
import { Badge } from './ui/badge';
import { useTranslation } from 'react-i18next';

export const PersonCard = ({ person }: { person: PeopleSelect }) => {
  const { t } = useTranslation();

  return (
    <Link className="w-full" to={`/people/${person.id}`}>
      <Card className="p-4">
        {person.main_image_key ? (
          <img
            className="rounded aspect-video object-cover"
            src={`${import.meta.env.VITE_API_URL}image/${person.main_image_key}`}
          ></img>
        ) : (
          <div className="rounded bg-zinc-300 aspect-video text-zinc-600 flex justify-center items-center gap-4">
            <p>{t('no_image')}</p>
            <FileImage />
          </div>
        )}

        <div className="flex pt-4 justify-between">
          <div>
            <p className="font-semibold">{person.name}</p>
          </div>
          {person.type && <Badge className="h-6">{t(person.type)}</Badge>}
        </div>
      </Card>
    </Link>
  );
};
