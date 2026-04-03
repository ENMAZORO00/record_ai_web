import type { ReactElement } from 'react';
import Layout from '../components/layouts/primaryLayout';
import { NextPageWithLayout } from './_app';
import ResetPassword from '../components/page/ResetPassword';

const Page: NextPageWithLayout = () => {
  return <ResetPassword />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
