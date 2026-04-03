import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MicIcon from '@mui/icons-material/Mic';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import { useChatThreads } from '@/src/contexts/ChatThreadsContext';
import { FONTFAMILY } from '@/src/lib/constants/font';

import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

const USER_FIRST_NAME = 'Shubham';

export default function DashboardAssistantHome() {
  const router = useRouter();
  const { createThreadWithUserMessage } = useChatThreads();
  const [message, setMessage] = useState('');

  const send = useCallback(() => {
    const text = message.trim();
    if (!text) return;
    const id = createThreadWithUserMessage(text);
    setMessage('');
    router.push(`/dashboard/chat/${id}`);
  }, [message, createThreadWithUserMessage, router]);

  return (
    <Box
      sx={{
        position: 'relative',
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 4 },
        py: { xs: 4, sm: 6 },
        overflow: 'auto',
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: 720,
          width: '100%',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontFamily: FONTFAMILY.PRIMARY,
            fontWeight: 700,
            color: 'text.primary',
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
            mb: 1,
          }}
        >
          Hi, {USER_FIRST_NAME}!
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontFamily: FONTFAMILY.PRIMARY,
            fontWeight: 400,
            color: '#90A4AE',
            fontSize: { xs: '1.75rem', sm: '2.75rem' },
            lineHeight: 1.25,
            mb: { xs: 4, sm: 5 },
          }}
        >
          How can I help you?
        </Typography>

        <Box sx={{ mb: 3 }}>
          <IconButton
            aria-label="Start recording"
            sx={{
              width: 88,
              height: 88,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: 2,
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <MicIcon sx={{ fontSize: 40 }} />
          </IconButton>
          <Typography
            variant="body2"
            sx={{
              mt: 1.5,
              fontFamily: FONTFAMILY.PRIMARY,
              fontWeight: 600,
              color: 'primary.main',
              fontSize: '0.8rem',
            }}
          >
            Start Recording
          </Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="Type your message here..."
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          slotProps={{
            input: {
              sx: { py: 0.5 },
              startAdornment: (
                <InputAdornment position="start">
                  <FormatListBulletedIcon
                    sx={{ color: 'text.secondary', fontSize: 22, ml: 0.5 }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Send message"
                    size="small"
                    onClick={send}
                    disabled={!message.trim()}
                    sx={{
                      bgcolor: message.trim() ? 'grey.300' : 'grey.200',
                      color: 'grey.700',
                      mr: 0.5,
                      '&:hover': { bgcolor: 'grey.400' },
                    }}
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 999,
              bgcolor: 'background.paper',
              pl: 1,
              '& fieldset': { borderColor: 'grey.300' },
            },
          }}
        />
      </Box>

      <Typography
        aria-hidden
        sx={{
          position: 'absolute',
          right: { xs: -16, sm: 24 },
          bottom: { xs: -24, sm: 16 },
          fontFamily: FONTFAMILY.PRIMARY,
          fontWeight: 700,
          fontSize: { xs: '8rem', sm: '12rem' },
          lineHeight: 1,
          color: 'grey.200',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        AI
      </Typography>
    </Box>
  );
}
