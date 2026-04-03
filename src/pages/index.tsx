import type { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';
import Layout from '../components/layouts/primaryLayout';
import HomePage from '../components/page/HomePage';

const Page: NextPageWithLayout = () => {
  return <HomePage />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
