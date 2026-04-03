import CheckCircle from '@mui/icons-material/CheckCircle';
import MailOutline from '@mui/icons-material/MailOutline';
import {
  Box,
  Button,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { useCallback, useRef, useState } from 'react';

const PAGE_BG = '#F3F4F6';
const CARD_BG = '#FFFFFF';
const BRAND_RED = '#D32F2F';
const BRAND_RED_HOVER = '#C62828';
const ICON_PINK_BG = '#FDF2F2';
const INPUT_BG = '#F8FAFC';
const SUBTITLE_GREY = '#64748B';
const RESEND_HINT = '#94A3B8';
const LINK_PURPLE = '#553CFB';
const FOOTER_GREY = '#64748B';

const OTP_LEN = 6;

const VerifyCompanyPage = () => {
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LEN }, () => '')
  );
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = useCallback((index: number) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  }, []);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length === 0) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    if (raw.length >= OTP_LEN) {
      const chars = raw.slice(0, OTP_LEN).split('');
      setDigits(chars);
      focusAt(OTP_LEN - 1);
      return;
    }

    const char = raw.slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < OTP_LEN - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault();
      focusAt(index - 1);
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusAt(index - 1);
    }
    if (e.key === 'ArrowRight' && index < OTP_LEN - 1) {
      e.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LEN);
    if (!text) return;
    const next = Array.from({ length: OTP_LEN }, (_, i) => text[i] ?? '');
    setDigits(next);
    const lastFilled = Math.min(text.length, OTP_LEN) - 1;
    focusAt(Math.max(0, lastFilled));
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100dvh - 72px)',
        width: '100%',
        bgcolor: PAGE_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: CARD_BG,
          borderRadius: '24px',
          boxShadow: '0px 8px 32px rgba(15, 23, 42, 0.08)',
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
        }}
      >
        <Stack spacing={0} alignItems="center">
          <Box
            sx={{
              position: 'relative',
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: ICON_PINK_BG,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <MailOutline sx={{ fontSize: 36, color: BRAND_RED }} aria-hidden />
            <CheckCircle
              sx={{
                position: 'absolute',
                bottom: 6,
                right: 6,
                fontSize: 22,
                color: BRAND_RED,
                bgcolor: CARD_BG,
                borderRadius: '50%',
              }}
              aria-hidden
            />
          </Box>

          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.25rem', sm: '1.375rem' },
              textAlign: 'center',
            }}
          >
            Verify your email
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 1.5,
              mb: 3,
              color: SUBTITLE_GREY,
              lineHeight: 1.6,
              textAlign: 'center',
              maxWidth: 300,
              fontSize: '0.875rem',
            }}
          >
            Enter the 6-digit code sent to your email
          </Typography>

          <Stack
            direction="row"
            spacing={1.25}
            justifyContent="center"
            sx={{ width: '100%', mb: 3 }}
          >
            {digits.map((value, index) => (
              <Box
                key={index}
                component="input"
                ref={(el: HTMLInputElement | null) => {
                  inputsRef.current[index] = el;
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                placeholder="0"
                value={value}
                aria-label={`Digit ${index + 1} of ${OTP_LEN}`}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(index, e)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(index, e)
                }
                onPaste={index === 0 ? handlePaste : undefined}
                sx={{
                  width: { xs: 44, sm: 48 },
                  height: { xs: 48, sm: 52 },
                  textAlign: 'center',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#334155',
                  bgcolor: INPUT_BG,
                  border: '1px solid transparent',
                  borderRadius: '8px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  '&::placeholder': {
                    color: '#94A3B8',
                    opacity: 1,
                  },
                  '&:focus': {
                    borderColor: 'rgba(211, 47, 47, 0.25)',
                    boxShadow: '0 0 0 3px rgba(211, 47, 47, 0.12)',
                  },
                }}
              />
            ))}
          </Stack>

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: '50px',
              color: '#fff',
              bgcolor: BRAND_RED,
              boxShadow: '0px 10px 28px rgba(211, 47, 47, 0.35)',
              '&:hover': {
                bgcolor: BRAND_RED_HOVER,
                boxShadow: '0px 12px 32px rgba(211, 47, 47, 0.4)',
              },
            }}
          >
            Verify & Continue
          </Button>

          <Typography
            variant="caption"
            sx={{
              mt: 3,
              display: 'block',
              textAlign: 'center',
              color: RESEND_HINT,
              fontSize: '0.8125rem',
            }}
          >
            Didn&apos;t receive the code?
          </Typography>

          <Link
            component="button"
            type="button"
            underline="none"
            sx={{
              mt: 0.5,
              fontWeight: 600,
              fontSize: '0.875rem',
              color: LINK_PURPLE,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              fontFamily: 'inherit',
              '&:hover': {
                color: '#4529C4',
              },
            }}
          >
            Resend code
          </Link>

          <Divider
            sx={{
              width: '100%',
              mt: 3,
              mb: 0.5,
              borderColor: 'rgba(15, 23, 42, 0.06)',
            }}
          />

          <Link
            href="/registerCompany"
            underline="none"
            sx={{
              mt: 2,
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: FOOTER_GREY,
              '&:hover': {
                color: '#475569',
              },
            }}
          >
            ← Back to registration
          </Link>
        </Stack>
      </Paper>
    </Box>
  );
};

export default VerifyCompanyPage;
