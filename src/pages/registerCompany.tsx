import type { ReactElement } from 'react';
import Layout from '../components/layouts/primaryLayout';
import { NextPageWithLayout } from './_app';
import RegisterCompanyPage from '../components/page/registerCompanyPage';

const Page: NextPageWithLayout = () => {
  return <RegisterCompanyPage />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
