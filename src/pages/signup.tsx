import type { ReactElement } from 'react';
import Layout from '../components/layouts/primaryLayout';
import SignUpPage from '../components/page/SignUpPage';
import { NextPageWithLayout } from './_app';

const Page: NextPageWithLayout = () => {
  return <SignUpPage />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
