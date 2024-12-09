import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useState } from 'react';
import { PeopleSelect } from '../../../../models/people';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { PersonCard } from './PersonCard';
import { useTranslation } from 'react-i18next';

const filterTypes = ['children', 'elderly', 'special_needs'] as const;

export const PeopleList = ({ data }: { data: PeopleSelect[] }) => {
  const { t } = useTranslation();
  const [parent] = useAutoAnimate({ duration: 50 });
  const [filter, setFilter] = useState<
    'children' | 'elderly' | 'special_needs' | undefined
  >();

  const filteredData = data.filter((person) => {
    if (!filter) {
      return true;
    }

    if (filter === person.type) {
      return true;
    } else {
      return false;
    }
  });

  const handleFilter = (
    filterKey: 'children' | 'elderly' | 'special_needs' | undefined
  ) => {
    setFilter(filterKey);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {filterTypes.map((filterType) => {
          const isSelected = filterType === filter;

          return (
            <Button
              variant={`${isSelected ? 'default' : 'outline'}`}
              onClick={() => {
                if (isSelected) {
                  return handleFilter(undefined);
                }

                return handleFilter(filterType);
              }}
              key={filterType}
            >
              {t(filterType)}
            </Button>
          );
        })}
      </div>
      <div
        ref={parent}
        className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {filteredData.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
        {filteredData.length === 0 && (
          <div>
            <p>{t('no_match')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
