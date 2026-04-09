import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { DASHBOARD_NAV_ITEMS } from '@/src/config/dashboardNav';
import { useChatThreads } from '@/src/contexts/ChatThreadsContext';
import { FONTFAMILY } from '@/src/lib/constants/font';
import { apiService } from '@/src/services/api';

import Link from 'next/link';
import { useRouter } from 'next/router';

export const SIDEBAR_WIDTH_EXPANDED = 288;
export const SIDEBAR_WIDTH_COLLAPSED = 56;

type DashboardSidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  userDisplayName?: string;
};

export default function DashboardSidebar({
  collapsed,
  onToggleCollapsed,
  userDisplayName = 'SHUBHAM PAL',
}: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = router.pathname;
  const chatId =
    typeof router.query.chatId === 'string' ? router.query.chatId : null;

  const {
    filteredThreads,
    historySearch,
    setHistorySearch,
    createThreadWithUserMessage,
    deleteThread,
    loading: chatLoading,
    error: chatError,
  } = useChatThreads();

  const handleNewChat = async () => {
    const id = await createThreadWithUserMessage('');
    if (id) {
      router.push(`/dashboard/chat/${id}`);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      await apiService.logout(token);
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    router.push('/');
  };

  return (
    <Box
      component="nav"
      sx={{
        width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
        flexShrink: 0,
        bgcolor: '#F5F5F5',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        minHeight: 0,
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        overflow: 'hidden',
      }}
      aria-label="Dashboard navigation"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 1,
          px: collapsed ? 0.5 : 1.5,
          pt: 2,
          pb: 1.5,
          minHeight: 48,
        }}
      >
        {!collapsed && (
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontFamily: FONTFAMILY.PRIMARY,
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'text.primary',
              letterSpacing: '-0.02em',
              flex: 1,
              minWidth: 0,
              pl: 0.5,
            }}
          >
            Shoten AI
          </Typography>
        )}
        <Tooltip
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          placement="right"
        >
          <IconButton
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            size="small"
            sx={{
              color: 'text.secondary',
              flexShrink: 0,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            {collapsed ? (
              <KeyboardDoubleArrowRightIcon sx={{ fontSize: 22 }} />
            ) : (
              <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 22 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <List sx={{ px: collapsed ? 0.5 : 1.5, py: 0, flexShrink: 0 }}>
          {DASHBOARD_NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive =
              href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === href || pathname.startsWith(`${href}/`);

            const itemButton = (
              <ListItemButton
                component={Link}
                href={href}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  py: 1.1,
                  px: collapsed ? 1 : 2,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                    '&:hover': { bgcolor: 'action.selected' },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: 'center',
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 22,
                      color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                  />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: {
                        fontFamily: FONTFAMILY.PRIMARY,
                        fontSize: '0.92rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'primary.main' : 'text.secondary',
                      },
                    }}
                  />
                )}
              </ListItemButton>
            );

            return (
              <ListItem
                key={href}
                disablePadding
                sx={{ display: 'block', mb: 0.5 }}
              >
                {collapsed ? (
                  <Tooltip title={label} placement="right">
                    {itemButton}
                  </Tooltip>
                ) : (
                  itemButton
                )}
              </ListItem>
            );
          })}
        </List>

        {/* Removed New Chat button */}

        {!collapsed && (
          <Box
            sx={{
              px: 1.5,
              pt: 1,
              pb: 0.5,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontFamily: FONTFAMILY.PRIMARY,
                fontWeight: 700,
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                color: 'text.disabled',
                textTransform: 'uppercase',
                pl: 0.5,
              }}
            >
              Chat history
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search chat history"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ fontSize: 18, color: 'text.disabled' }}
                      />
                    </InputAdornment>
                  ),
                  sx: {
                    fontFamily: FONTFAMILY.PRIMARY,
                    fontSize: '0.85rem',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                  },
                },
              }}
              sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        )}

        {!collapsed && (
          <List
            dense
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 0.5,
              py: 0.5,
            }}
          >
            {chatLoading && (
              <ListItem>
                <ListItemText
                  primary={
                    <span style={{ color: '#888' }}>Loading chats…</span>
                  }
                />
              </ListItem>
            )}
            {!chatLoading && filteredThreads.length === 0 && (
              <ListItem>
                <ListItemText
                  primary={
                    <span style={{ color: '#888' }}>No chats found</span>
                  }
                />
              </ListItem>
            )}
            {filteredThreads.map((t) => {
              const href = `/dashboard/chat/${t.id}`;
              const isChatActive = chatId === t.id;
              const lastMsg =
                t.messages && t.messages.length > 0
                  ? t.messages[t.messages.length - 1]
                  : null;
              return (
                <ListItem
                  key={t.id}
                  disablePadding
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <ListItemButton
                    component={Link}
                    href={href}
                    selected={isChatActive}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      px: 1.5,
                      alignItems: 'flex-start',
                      flex: 1,
                      '&.Mui-selected': {
                        bgcolor: 'action.selected',
                        '&:hover': { bgcolor: 'action.selected' },
                      },
                    }}
                  >
                    <ListItemText
                      primary={t.title}
                      primaryTypographyProps={{
                        noWrap: true,
                        sx: {
                          fontFamily: FONTFAMILY.PRIMARY,
                          fontSize: '0.88rem',
                          color: isChatActive ? 'primary.main' : 'text.primary',
                          fontWeight: isChatActive ? 600 : 400,
                        },
                      }}
                      secondary={
                        lastMsg
                          ? `${lastMsg.role === 'assistant' ? 'AI: ' : 'You: '}${lastMsg.content.slice(0, 40)}${lastMsg.content.length > 40 ? '…' : ''}`
                          : 'No messages'
                      }
                      secondaryTypographyProps={{
                        noWrap: true,
                        sx: {
                          fontFamily: FONTFAMILY.PRIMARY,
                          fontSize: '0.72rem',
                          mt: 0.25,
                        },
                      }}
                    />
                  </ListItemButton>
                  <Tooltip title="Delete chat">
                    <IconButton
                      size="small"
                      edge="end"
                      aria-label="delete"
                      sx={{ ml: 0.5, mr: 1 }}
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (window.confirm('Delete this chat?')) {
                          await deleteThread(t.id);
                          // If deleted chat is open, redirect to dashboard
                          if (chatId === t.id) router.push('/dashboard');
                        }
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      <Box
        sx={{
          px: collapsed ? 0.5 : 2,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          alignItems: collapsed ? 'center' : 'stretch',
          flexShrink: 0,
        }}
      >
        {collapsed ? (
          <Tooltip title="Sign Out" placement="right">
            <IconButton
              aria-label="Sign Out"
              onClick={handleLogout}
              sx={{
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <LogoutOutlinedIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            <Button
              fullWidth
              startIcon={<LogoutOutlinedIcon sx={{ fontSize: 22 }} />}
              onClick={handleLogout}
              sx={{
                justifyContent: 'flex-start',
                px: 1,
                py: 1,
                color: 'text.secondary',
                textTransform: 'none',
                fontFamily: FONTFAMILY.PRIMARY,
                fontWeight: 500,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Sign Out
            </Button>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1.5,
                px: 1,
                fontFamily: FONTFAMILY.PRIMARY,
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: 'text.disabled',
              }}
            >
              {userDisplayName}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
