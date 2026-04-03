import type { ReactElement } from 'react';
import Layout from '../components/layouts/primaryLayout';
import { NextPageWithLayout } from './_app';
import VerifyCompanyPage from '../components/page/VerifyCompanyPage';

const Page: NextPageWithLayout = () => {
  return <VerifyCompanyPage />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
