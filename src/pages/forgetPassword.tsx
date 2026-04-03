import type { ReactElement } from 'react';
import Layout from '../components/layouts/primaryLayout';
import ForgetPassword from '../components/page/ForgetPassword';
import { NextPageWithLayout } from './_app';

const Page: NextPageWithLayout = () => {
  return <ForgetPassword />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
