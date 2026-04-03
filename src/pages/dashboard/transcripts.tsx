import type { ReactElement } from 'react';

import { Box, Typography } from '@mui/material';

import { NextPageWithLayout } from '../_app';
import { FONTFAMILY } from '@/src/lib/constants/font';
import { getDashboardLayout } from '@/src/lib/getDashboardLayout';

const Page: NextPageWithLayout = () => {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        overflow: 'auto',
        p: { xs: 2, sm: 4 },
      }}
    >
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ fontFamily: FONTFAMILY.PRIMARY, maxWidth: 560 }}
      >
        Transcripts will appear here once you connect recordings or uploads.
      </Typography>
    </Box>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return getDashboardLayout(page, { topBarTitle: 'Transcripts' });
};

export default Page;
