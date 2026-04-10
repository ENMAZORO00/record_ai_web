import type { ReactElement } from 'react';
import { NextPageWithLayout } from '../_app';
import InviteMembersPage from '@/src/components/dashboard/views/InviteMembersPage';
import { getDashboardLayout } from '@/src/lib/getDashboardLayout';

const Page: NextPageWithLayout = () => {
  return <InviteMembersPage />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return getDashboardLayout(page);
};

export default Page;
