import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Box } from '@mui/material';

import { type ReactNode, useCallback, useState } from 'react';

import DashboardSidebar from '@/src/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/src/components/dashboard/DashboardTopBar';
import { ChatThreadsProvider } from '@/src/contexts/ChatThreadsContext';

const dashboardTheme = createTheme({
  palette: {
    primary: {
      main: '#E53935',
      dark: '#C62828',
      contrastText: '#fff',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
});

type DashboardLayoutProps = {
  children: ReactNode;
  topBarTitle?: string;
};

export default function DashboardLayout({
  children,
  topBarTitle,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  return (
    <ThemeProvider theme={dashboardTheme}>
      <ChatThreadsProvider>
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            maxHeight: '100dvh',
            overflow: 'hidden',
            bgcolor: 'background.default',
          }}
        >
          <DashboardSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapsed={toggleSidebar}
          />
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              minHeight: 0,
              height: '100%',
              overflow: 'hidden',
              bgcolor: 'background.paper',
            }}
          >
            <DashboardTopBar title={topBarTitle} />
            <Box
              component="main"
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
                position: 'relative',
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </ChatThreadsProvider>
    </ThemeProvider>
  );
}
