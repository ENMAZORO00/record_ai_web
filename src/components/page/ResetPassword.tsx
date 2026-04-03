import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { useCallback, useRef, useState } from 'react';

const BG = '#F0F1F3';
const CARD = '#FFFFFF';
const BRAND_RED = '#E53935';
const BRAND_RED_SHADOW = 'rgba(229, 57, 53, 0.45)';
const OTP_CELL_BG = '#F2F2F2';
const PASSWORD_FIELD_BG = '#F5F5F5';
const MUTED_GRAY = '#868E96';
const MUTED_LABEL = '#6C757D';
const LINK_INDIGO = '#3F51B5';

const OTP_LEN = 6;

const passwordFieldSx = {
  '& .MuiFilledInput-root': {
    backgroundColor: PASSWORD_FIELD_BG,
    borderRadius: '12px',
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: PASSWORD_FIELD_BG,
    },
    '&.Mui-focused': {
      backgroundColor: PASSWORD_FIELD_BG,
    },
    '&::before, &::after': {
      display: 'none',
    },
  },
  '& .MuiFilledInput-input': {
    py: 1.75,
    fontSize: '0.95rem',
  },
  '& .MuiFilledInput-input::placeholder': {
    color: MUTED_GRAY,
    opacity: 1,
  },
} as const;

const ResetPassword = () => {
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LEN }, () => ''),
  );
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = useCallback((index: number) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  }, []);

  const handleOtpChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
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

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
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

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
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
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 18% 22%, rgba(159, 168, 218, 0.14) 0%, transparent 42%),
            radial-gradient(circle at 82% 78%, rgba(186, 170, 220, 0.12) 0%, transparent 38%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.5) 0%, transparent 55%)
          `,
          pointerEvents: 'none',
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          left: { xs: 16, sm: 24 },
          bottom: 16,
          color: 'rgba(0,0,0,0.28)',
          fontSize: '0.7rem',
          letterSpacing: '0.04em',
          fontWeight: 500,
          zIndex: 1,
        }}
      >
        SHOTEN AICORE — V2.4.0
      </Typography>

      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 440,
          bgcolor: CARD,
          borderRadius: '24px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
          px: { xs: 2.5, sm: 4 },
          py: { xs: 3.5, sm: 4 },
        }}
      >
        <Box sx={{ position: 'relative', mb: 1 }}>
          <IconButton
            component={Link}
            href="/forgetPassword"
            aria-label="Back"
            size="small"
            sx={{
              position: 'absolute',
              left: -8,
              top: -4,
              color: '#212529',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Box>

        <Stack spacing={3} alignItems="stretch">
          <Box textAlign="center">
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#212529',
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                mb: 1,
              }}
            >
              Reset Password
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: MUTED_GRAY, lineHeight: 1.5 }}
            >
              Create a strong new password
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: MUTED_LABEL,
                fontSize: '0.6875rem',
                mb: 1.5,
              }}
            >
              ENTER 6-DIGIT OTP
            </Typography>
            <Stack
              direction="row"
              spacing={1.25}
              justifyContent="center"
              sx={{ width: '100%' }}
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
                  aria-label={`OTP digit ${index + 1} of ${OTP_LEN}`}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleOtpChange(index, e)
                  }
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                    handleOtpKeyDown(index, e)
                  }
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  sx={{
                    width: { xs: 44, sm: 48 },
                    height: { xs: 48, sm: 52 },
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#212529',
                    bgcolor: OTP_CELL_BG,
                    border: 'none',
                    borderRadius: '8px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    '&:focus': {
                      boxShadow: `0 0 0 2px ${BRAND_RED}33`,
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Stack spacing={2}>
            <TextField
              fullWidth
              variant="filled"
              hiddenLabel
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: MUTED_GRAY, fontSize: 22 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowNewPassword((v) => !v)}
                      edge="end"
                      size="small"
                      sx={{ color: MUTED_GRAY }}
                    >
                      {showNewPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={passwordFieldSx}
            />

            <TextField
              fullWidth
              variant="filled"
              hiddenLabel
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: MUTED_GRAY, fontSize: 22 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      edge="end"
                      size="small"
                      sx={{ color: MUTED_GRAY }}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={passwordFieldSx}
            />
          </Stack>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<VpnKeyIcon sx={{ fontSize: 20 }} />}
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: 9999,
              color: '#fff',
              bgcolor: BRAND_RED,
              boxShadow: `0 10px 28px ${BRAND_RED_SHADOW}`,
              '&:hover': {
                bgcolor: '#D32F2F',
                boxShadow: `0 12px 32px ${BRAND_RED_SHADOW}`,
              },
            }}
          >
            Reset Password
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link
              component="button"
              type="button"
              underline="none"
              sx={{
                fontWeight: 700,
                fontSize: '0.875rem',
                color: LINK_INDIGO,
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                fontFamily: 'inherit',
                '&:hover': {
                  color: '#303F9F',
                },
              }}
            >
              Resend OTP
            </Link>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
