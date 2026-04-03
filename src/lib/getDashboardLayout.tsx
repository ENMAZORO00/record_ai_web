import { type ReactElement } from 'react';

import DashboardLayout from '@/src/components/layouts/dashboardLayout';

type Options = {
  topBarTitle?: string;
};

export function getDashboardLayout(page: ReactElement, options?: Options) {
  return (
    <DashboardLayout topBarTitle={options?.topBarTitle}>
      {page}
    </DashboardLayout>
  );
}
