'use client';

import CheckCircle from '@mui/icons-material/CheckCircle';
import MailOutline from '@mui/icons-material/MailOutline';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiService } from '@/src/services/api';

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
const ERROR_RED = '#D32F2F';
const MUTED_GRAY = '#868E96';

const OTP_LEN = 6;

interface VerifyParams {
  email: string;
  name: string;
  password: string;
  companyName: string;
}

const VerifyCompanyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length: OTP_LEN }, () => '')
  );
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [params, setParams] = useState<VerifyParams | null>(null);
  const [paramError, setParamError] = useState(false);

  // Extract and validate query parameters
  useEffect(() => {
    try {
      const email = searchParams.get('email');
      const name = searchParams.get('name');
      const password = searchParams.get('password');
      const companyName = searchParams.get('companyName');

      if (!email || !name || !password || !companyName) {
        setParamError(true);
        return;
      }

      setParams({ email, name, password, companyName });
    } catch {
      setParamError(true);
    }
  }, [searchParams]);

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

  // Validate OTP
  const validateOtp = (): boolean => {
    const otp = digits.join('');
    if (!otp || otp.length !== OTP_LEN) {
      setError('Please enter the 6-digit code');
      return false;
    }
    return true;
  };

  // Handle verify and register
  const handleVerifyAndRegister = async () => {
    if (!params) {
      setError('Missing registration data. Please go back and try again.');
      return;
    }

    if (!validateOtp()) return;

    setLoading(true);
    setError('');

    try {
      const otp = digits.join('');

      // Step 1: Verify OTP
      const verifyResponse = await apiService.verifyOtp(
        params.email,
        otp,
        params.name,
        params.password
      );

      if (verifyResponse.error) {
        setError(verifyResponse.error || 'Invalid or expired OTP');
        setLoading(false);
        return;
      }

      // Step 2: Register company (no auth required)
      const companyResponse = await apiService.registerCompanyPublic(
        params.email,
        params.companyName
      );

      if (companyResponse.error) {
        setError(companyResponse.error || 'Failed to register company');
        setLoading(false);
        return;
      }

      // Step 3: Navigate to the app dashboard after company registration
      router.push('/dashboard');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    if (!params) {
      setError('Missing registration data. Please go back and try again.');
      return;
    }

    setResending(true);
    setError('');

    try {
      const response = await apiService.signup(
        params.name,
        params.email,
        params.password
      );

      if (response.error) {
        setError(response.error || 'Failed to resend OTP');
      } else {
        setError('');
        setDigits(Array.from({ length: OTP_LEN }, () => ''));
        focusAt(0);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(errorMessage);
    } finally {
      setResending(false);
    }
  };

  // Redirect if params are missing
  if (paramError) {
    return (
      <Box
        sx={{
          minHeight: 'calc(100dvh - 72px)',
          width: '100%',
          bgcolor: PAGE_BG,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
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
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: ERROR_RED, fontWeight: 600, mb: 2 }}
          >
            Missing registration data
          </Typography>
          <Typography variant="body2" sx={{ color: SUBTITLE_GREY, mb: 3 }}>
            Please go back to the registration page and try again.
          </Typography>
          <Link
            href="/registerCompany"
            underline="none"
            sx={{
              display: 'inline-block',
              fontWeight: 600,
              color: LINK_PURPLE,
              '&:hover': {
                color: '#4529C4',
              },
            }}
          >
            ← Back to registration
          </Link>
        </Paper>
      </Box>
    );
  }

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
        px: 2,
        py: 4,
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
            Enter the 6-digit code sent to {params?.email}
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
                disabled={loading}
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
                  cursor: loading ? 'not-allowed' : 'text',
                  opacity: loading ? 0.6 : 1,
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

          {/* Error message */}
          {error && (
            <Typography
              sx={{
                color: ERROR_RED,
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'center',
                p: 1,
                mb: 1.5,
                bgcolor: 'rgba(211, 47, 47, 0.08)',
                borderRadius: '6px',
                width: '100%',
              }}
            >
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            onClick={handleVerifyAndRegister}
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
              '&:disabled': {
                bgcolor: MUTED_GRAY,
                opacity: 0.6,
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                Verifying...
              </Box>
            ) : (
              'Verify & Continue'
            )}
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

          <Button
            component="button"
            type="button"
            disabled={resending || loading}
            onClick={handleResend}
            sx={{
              mt: 0.5,
              fontWeight: 600,
              fontSize: '0.875rem',
              color: LINK_PURPLE,
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              fontFamily: 'inherit',
              p: 0,
              textTransform: 'none',
              '&:hover': {
                color: '#4529C4',
              },
              '&:disabled': {
                opacity: 0.6,
              },
            }}
          >
            {resending ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CircularProgress size={14} />
                Resending...
              </Box>
            ) : (
              'Resend code'
            )}
          </Button>

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
