'use client';
import Navbar from '@/layouts/landing/Navbar';
import Hero_Join from './_containers/Hero_Join';
import { useState } from 'react';
import { columnsVacancyLanding } from '@/constant/table/vacancy_landing.columns';
import { DataTable } from '@/components/Data-Table';
import Forms from './_containers/forms';
import { useQuery } from '@/hooks/useQuery.hooks';

export default function Join() {
  const [showPopup, setShowPopup] = useState(false);

  const { data: openVacancyData, isLoading } = useQuery({
    path: '/intern/vacancy?filter=open',
    queryKey: ['vacancyOpen'],
  });

  const vacancies = openVacancyData?.vacancy ?? [];
  console.log(vacancies);

  return (
    <div className='w-screen h-auto bg-ghost-white'>
      <div className={`w-screen ${showPopup ? 'hidden' : 'block'}`}>
        <Navbar />
        <Hero_Join />
        <section className='px-24 mt-10 pb-10'>
          <DataTable
            className={{
              table: 'bg-white',
              header: 'text-lightgray font-bold',
            }}
            columns={columnsVacancyLanding({ setShowPopup })}
            data={vacancies}
            isLoading={isLoading}
          />
        </section>
      </div>
      <Forms
        onChangeSetPopup={setShowPopup}
        className={`${showPopup ? 'flex' : 'hidden'}`}
      />
    </div>
  );
}
