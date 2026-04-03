import type { ReactElement } from 'react';

import { NextPageWithLayout } from '../_app';
import DashboardAssistantHome from '@/src/components/dashboard/views/DashboardAssistantHome';
import { getDashboardLayout } from '@/src/lib/getDashboardLayout';

const Page: NextPageWithLayout = () => {
  return <DashboardAssistantHome />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return getDashboardLayout(page);
};

export default Page;
