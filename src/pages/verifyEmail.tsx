import type { ReactElement } from 'react';
import Layout from '../components/layouts/primaryLayout';
import VerifyEmailPage from '../components/page/VerifyEmailPage';
import { NextPageWithLayout } from './_app';

const Page: NextPageWithLayout = () => {
  return <VerifyEmailPage />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
