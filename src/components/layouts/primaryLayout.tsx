import { ReactNode } from 'react';
import WebsiteNavbar from '../molecules/WebsiteNavbar.tsx/websiteNavbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <WebsiteNavbar />
      <main>{children}</main>
    </>
  );
}
