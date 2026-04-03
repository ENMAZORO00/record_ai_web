import { FONTFAMILY } from '@/src/lib/constants/font';

import {
  AppBar,
  Box,
  Chip,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const navItems = [
  { label: 'Shoten Story', href: '/shoten-story' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Security', href: '/security' },
  { label: 'Blog', href: '/blog' },
];

function WebsiteNavbar() {
  return (
    <AppBar
      position="sticky"
      sx={{
        boxShadow: 'none',
        backgroundColor: '#fcf9f9',
        paddingX: { xs: 3, lg: 16 },
        paddingY: { xs: 1 },
      }}
    >
      <Toolbar
        sx={{
          paddingX: '0 !important',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left Section (Logo) */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                fontFamily: FONTFAMILY.PRIMARY,
                fontSize: '35px',
                fontWeight: 'bold',
                textDecoration: 'none',
                color: '#5A332A',
              }}
            >
              Shoten AI
            </Typography>

            <Tooltip title="This is a beta release.">
              <Chip
                label="BETA"
                size="small"
                sx={{
                  ml: 1,
                  bgcolor: '#e8f0fe',
                  // color: '#1a73e8',
                  color: '#5A332A',
                  fontWeight: 600,
                  height: 20,
                }}
              />
            </Tooltip>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default WebsiteNavbar;
