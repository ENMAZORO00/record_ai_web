import { Box, Typography } from '@mui/material';

import { useChatThreads } from '@/src/contexts/ChatThreadsContext';
import { FONTFAMILY } from '@/src/lib/constants/font';

import { useRouter } from 'next/router';
import { useMemo } from 'react';

type DashboardTopBarProps = {
  title?: string;
};

export default function DashboardTopBar({ title: titleFromLayout }: DashboardTopBarProps) {
  const router = useRouter();
  const { getThread } = useChatThreads();

  const chatId =
    typeof router.query.chatId === 'string' ? router.query.chatId : undefined;

  const resolvedTitle = useMemo(() => {
    if (titleFromLayout != null && titleFromLayout !== '') {
      return titleFromLayout;
    }
    if (router.pathname === '/dashboard/chat/[chatId]') {
      if (chatId) {
        const thread = getThread(chatId);
        if (thread) return thread.title;
      }
      return 'Chat';
    }
    return 'AI Assistant';
  }, [titleFromLayout, router.pathname, chatId, getThread]);

  return (
    <Box
      component="header"
      sx={{
        flexShrink: 0,
        py: 2.5,
        px: { xs: 2, sm: 3 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="h6"
        noWrap
        sx={{
          fontFamily: FONTFAMILY.PRIMARY,
          fontWeight: 700,
          color: 'text.primary',
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
        }}
      >
        {resolvedTitle}
      </Typography>
    </Box>
  );
}
