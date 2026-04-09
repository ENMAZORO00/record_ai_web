import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

import { useChatThreads } from '@/src/contexts/ChatThreadsContext';
import { FONTFAMILY } from '@/src/lib/constants/font';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

const DEMO_ASSISTANT_REPLY =
  "Thanks for your message. I'm a demo assistant — connect your model here to stream real replies.";

/** ChatGPT-style centered column (~768px) inside full-width rows */
const CONTENT_MAX = 'min(100%, 48rem)';

const proseSx = {
  fontFamily: FONTFAMILY.PRIMARY,
  fontSize: { xs: '1rem', sm: '1.0625rem' },
  lineHeight: 1.75,
  color: 'text.primary',
  whiteSpace: 'pre-wrap' as const,
  overflowWrap: 'anywhere' as const,
  wordBreak: 'break-word' as const,
};

type ChatgptConversationViewProps = {
  chatId: string;
};

export default function ChatgptConversationView({
  chatId,
}: ChatgptConversationViewProps) {
  const { getThread, fetchThreadById, sendMessageToThread, loading, error } =
    useChatThreads();
  const thread = getThread(chatId);
  const [draft, setDraft] = useState('');
  const [initialLoaded, setInitialLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch thread messages on mount or chatId change
  useEffect(() => {
    if (!chatId) return;
    fetchThreadById(chatId).then(() => setInitialLoaded(true));
    // eslint-disable-next-line
  }, [chatId]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [thread?.messages.length, scrollToBottom]);

  const send = useCallback(async () => {
    if (!thread) return;
    const text = draft.trim();
    if (!text) return;
    await sendMessageToThread(thread.id, text);
    setDraft('');
  }, [thread, draft, sendMessageToThread]);

  if (!thread && !loading && initialLoaded) {
    return (
      <Box sx={{ p: 4, overflow: 'auto' }}>
        <Typography color="text.secondary" sx={{ fontSize: '1.0625rem' }}>
          Chat not found.
        </Typography>
      </Box>
    );
  }

  if (loading && !thread) {
    return (
      <Box
        sx={{
          p: 4,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const empty = !thread || thread.messages.length === 0;

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        minWidth: 0,
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        bgcolor: '#fff',
      }}
    >
      {/* Scrollable transcript — only this region scrolls */}
      <Box
        component="section"
        aria-label="Messages"
        sx={{
          flex: '1 1 0%',
          minHeight: 0,
          minWidth: 0,
          width: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {empty ? (
          <Box
            sx={{
              minHeight: '100%',
              width: '100%',
              maxWidth: CONTENT_MAX,
              mx: 'auto',
              px: { xs: 2, sm: 3 },
              py: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTFAMILY.PRIMARY,
                color: 'text.secondary',
                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              Start the conversation below.
            </Typography>
          </Box>
        ) : (
          <Fragment>
            <Box
              component="ul"
              sx={{
                width: '100%',
                maxWidth: '100%',
                listStyle: 'none',
                m: 0,
                p: 0,
                boxSizing: 'border-box',
              }}
            >
              {thread.messages.map((msg) =>
                msg.role === 'assistant' ? (
                  <Box
                    key={msg.id}
                    component="li"
                    sx={{
                      width: '100%',
                      bgcolor: '#f9f9f9',
                      borderBottom: '1px solid',
                      borderColor: 'rgba(0,0,0,0.06)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: CONTENT_MAX,
                        mx: 'auto',
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2.5, sm: 3 },
                        boxSizing: 'border-box',
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                        minWidth: 0,
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 36,
                          height: 36,
                          flexShrink: 0,
                          bgcolor: 'primary.main',
                          borderRadius: 1.25,
                        }}
                      >
                        <SmartToyOutlinedIcon
                          sx={{ fontSize: 22, color: 'primary.contrastText' }}
                        />
                      </Avatar>
                      <Typography
                        component="div"
                        sx={{
                          ...proseSx,
                          flex: 1,
                          minWidth: 0,
                          pt: 0.25,
                        }}
                      >
                        {msg.content}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    key={msg.id}
                    component="li"
                    sx={{
                      width: '100%',
                      bgcolor: '#fff',
                      borderBottom: '1px solid',
                      borderColor: 'rgba(0,0,0,0.06)',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: CONTENT_MAX,
                        mx: 'auto',
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2, sm: 2.5 },
                        boxSizing: 'border-box',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        minWidth: 0,
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          maxWidth: 'min(100%, 85%)',
                          minWidth: 0,
                          px: 2.25,
                          py: 1.75,
                          borderRadius: 3,
                          bgcolor: '#ececec',
                          color: 'text.primary',
                          boxShadow: 'none',
                        }}
                      >
                        <Typography
                          component="div"
                          sx={{
                            ...proseSx,
                            color: 'text.primary',
                          }}
                        >
                          {msg.content}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                )
              )}
            </Box>
            <Box
              ref={bottomRef}
              sx={{ height: 1, width: '100%', flexShrink: 0 }}
              aria-hidden
            />
          </Fragment>
        )}
      </Box>

      {/* Composer — fixed to bottom of panel, does not scroll away */}
      <Box
        component="footer"
        sx={{
          flexShrink: 0,
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          borderTop: '1px solid',
          borderColor: 'rgba(0,0,0,0.08)',
          bgcolor: '#fff',
          pt: 2,
          pb: { xs: 2, sm: 2.5 },
          px: { xs: 2, sm: 3 },
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: CONTENT_MAX,
            mx: 'auto',
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={6}
            placeholder="Ask anything…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            variant="outlined"
            slotProps={{
              input: {
                sx: {
                  borderRadius: '26px',
                  alignItems: 'flex-end',
                  px: 2,
                  py: 1.25,
                  minHeight: 52,
                  fontFamily: FONTFAMILY.PRIMARY,
                  fontSize: { xs: '1rem', sm: '1.0625rem' },
                  lineHeight: 1.5,
                  maxWidth: '100%',
                },
                endAdornment: (
                  <IconButton
                    aria-label="Send message"
                    onClick={send}
                    disabled={!draft.trim()}
                    sx={{
                      mb: 0.25,
                      mr: 0.25,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: draft.trim() ? 'primary.main' : '#e3e3e3',
                      color: draft.trim() ? 'primary.contrastText' : '#9e9e9e',
                      '&:hover': {
                        bgcolor: draft.trim() ? 'primary.dark' : '#d6d6d6',
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#ececec',
                        color: '#bdbdbd',
                      },
                    }}
                  >
                    <ArrowUpwardIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                ),
              },
            }}
            sx={{
              width: '100%',
              maxWidth: '100%',
              '& .MuiOutlinedInput-root': {
                bgcolor: '#fff',
                boxShadow:
                  '0 0 0 1px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
                '&:hover': {
                  boxShadow:
                    '0 0 0 1px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.08)',
                },
                '&.Mui-focused': {
                  boxShadow:
                    '0 0 0 2px rgba(229, 57, 53, 0.35), 0 4px 16px rgba(0,0,0,0.06)',
                },
                '& fieldset': { border: 'none' },
              },
            }}
          />
          {error && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                mt: 1.25,
                color: 'error.main',
                fontFamily: FONTFAMILY.PRIMARY,
                fontSize: '0.7rem',
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
