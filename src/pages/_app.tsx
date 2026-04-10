import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { type ReactElement, type ReactNode } from 'react';

import '../../styles/globals.css';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        {/* seo data */}
        <title>Shoten AI | Get Information from a meeting</title>
        <meta
          name="description"
          content="Get information from your meetings using AI"
        />
        <meta
          property="og:title"
          content="Shoten AI | Get Information from a meeting"
        />
        <meta
          property="og:description"
          content="Get information from your meetings using AI"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://www.shotenai.com/" />
        <meta property="og:site_name" content="shotenai.com" />
        <meta
          property="og:image"
          content="https://www.shotenai.com/image/opengraph-image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Shoten AI logo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://www.shotenai.com/image/opengraph-image.jpg"
        />
        {/* seo data above */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      {getLayout(<Component {...pageProps} />)}
    </>
  );
}
