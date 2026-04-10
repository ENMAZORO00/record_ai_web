import type { ReactElement } from 'react';
import { NextPageWithLayout } from '../_app';
import TeamPage from '@/src/components/dashboard/views/TeamPage';
import { getDashboardLayout } from '@/src/lib/getDashboardLayout';

const Page: NextPageWithLayout = () => {
  return <TeamPage />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return getDashboardLayout(page);
};

export default Page;
