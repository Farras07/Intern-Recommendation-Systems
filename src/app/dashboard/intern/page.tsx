'use client';
import { useState } from 'react';
import Layout from '@/layouts/dashboard/LayoutContainer';
import { useSearchParams } from 'next/navigation';
import DialogTab from './_components/dialogTab';
import DefaultContent from './_components/content/Default';

export default function InternPage() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const dialogToggle = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <Layout>
      <DefaultContent
        dialogToggle={dialogToggle}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      <DialogTab open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </Layout>
  );
}
