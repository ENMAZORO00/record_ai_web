import { Box, Button, Link, Paper, Stack, Typography } from '@mui/material';
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { useCallback, useRef, useState } from 'react';

const BG = '#F9F9F9';
const CARD = '#FFFFFF';
const BRAND_RED = '#D32F2F';
const INPUT_BG = '#F3F4F6';
const MUTED_BODY = '#6C757D';
const LINK_PURPLE = '#553CFB';
const FOOTER_MUTED = 'rgba(0, 0, 0, 0.38)';

const OTP_LEN = 6;

const VerifyEmailPage = () => {
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LEN }, () => ''),
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
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN);
    if (!text) return;
    const next = Array.from({ length: OTP_LEN }, (_, i) => text[i] ?? '');
    setDigits(next);
    const lastFilled = Math.min(text.length, OTP_LEN) - 1;
    focusAt(Math.max(0, lastFilled));
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 'calc(100dvh - 72px)',
        width: '100%',
        bgcolor: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: CARD,
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
        }}
      >
        <Stack spacing={0} alignItems="center">
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#212529',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.35rem', sm: '1.5rem' },
              textAlign: 'center',
            }}
          >
            Verify your email
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 2,
              mb: 3,
              color: MUTED_BODY,
              lineHeight: 1.6,
              textAlign: 'center',
              maxWidth: 320,
              fontSize: '0.875rem',
            }}
          >
            We&apos;ve sent a 6-digit code to your email. Please enter it below to
            continue.
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
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#212529',
                  bgcolor: INPUT_BG,
                  border: 'none',
                  borderRadius: '8px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  '&:focus': {
                    boxShadow: '0 0 0 2px rgba(85, 60, 251, 0.35)',
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
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#C62828',
                boxShadow: 'none',
              },
            }}
          >
            Verify & Continue
          </Button>

          <Link
            component="button"
            type="button"
            underline="none"
            sx={{
              mt: 2.5,
              fontWeight: 600,
              fontSize: '0.9375rem',
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
            Resend Code
          </Link>
        </Stack>
      </Paper>

      <Typography
        variant="caption"
        sx={{
          mt: 3,
          textAlign: 'center',
          color: FOOTER_MUTED,
          fontSize: '0.75rem',
          maxWidth: 360,
          lineHeight: 1.5,
        }}
      >
        Didn&apos;t receive the email? Check your spam folder.
      </Typography>
    </Box>
  );
};

export default VerifyEmailPage;
