import type { ReactElement } from 'react';

import { Box } from '@mui/material';

import { useRouter } from 'next/router';

import { NextPageWithLayout } from '../../_app';
import ChatgptConversationView from '@/src/components/dashboard/chat/ChatgptConversationView';
import { getDashboardLayout } from '@/src/lib/getDashboardLayout';

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const chatId =
    typeof router.query.chatId === 'string' ? router.query.chatId : '';

  if (!router.isReady || !chatId) {
    return null;
  }

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <ChatgptConversationView chatId={chatId} />
    </Box>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return getDashboardLayout(page);
};

export default Page;
