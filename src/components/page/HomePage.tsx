import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { googleAuthService } from '../../lib/googleAuth';

const BG = '#F8F9FA';
const CARD = '#FFFFFF';
const BRAND_RED = '#B21E1E';
const INPUT_BG = '#F1F3F5';
const LABEL_GRAY = '#6C757D';
const LAVENDER = '#E8EAF6';
const BANNER_ICON_BG = '#3949AB';
const FORGOT_BLUE = '#5C6BC0';

function GoogleIcon() {
  return (
    <Box
      aria-hidden
      component="svg"
      sx={{ width: 18, height: 18, flexShrink: 0 }}
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </Box>
  );
}

const fieldSx = {
  '& .MuiFilledInput-root': {
    backgroundColor: INPUT_BG,
    borderRadius: 2,
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: INPUT_BG,
    },
    '&.Mui-focused': {
      backgroundColor: INPUT_BG,
    },
  },
  '& .MuiFilledInput-input': {
    py: 1.75,
    fontSize: '0.95rem',
  },
} as const;

function FieldLabel({ children }: { children: string }) {
  return (
    <Typography
      component="label"
      variant="caption"
      sx={{
        display: 'block',
        fontWeight: 700,
        letterSpacing: '0.06em',
        color: LABEL_GRAY,
        textTransform: 'uppercase',
        mb: 0.75,
      }}
    >
      {children}
    </Typography>
  );
}

const HomePage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    googleAuthService.initialize();
  }, []);

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const result = await googleAuthService.signIn();
      if (result) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('authUser', JSON.stringify(result.user));
        await router.replace('/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data?.error || 'Invalid email or password');
        return;
      }

      if (data?.token) {
        localStorage.setItem('authToken', data.token);
      }
      if (data?.user) {
        localStorage.setItem('authUser', JSON.stringify(data.user));
      }
      await router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100dvh - 72px)',
        width: '100%',
        bgcolor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: CARD,
          borderRadius: 3,
          boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.06)',
          px: { xs: 2.5, sm: 4 },
          py: { xs: 3, sm: 4 },
        }}
      >
        <Stack spacing={3} alignItems="stretch">
          <Box textAlign="center">
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#212529',
                letterSpacing: '-0.02em',
                mb: 0.75,
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: LABEL_GRAY }}>
              Please enter your details to sign in
            </Typography>
          </Box>

          <Stack spacing={2}>
            <Box>
              <FieldLabel>Email address</FieldLabel>
              <TextField
                fullWidth
                variant="filled"
                hiddenLabel
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={fieldSx}
              />
            </Box>

            <Box>
              <FieldLabel>Password</FieldLabel>
              <TextField
                fullWidth
                variant="filled"
                hiddenLabel
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        sx={{ color: LABEL_GRAY }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />
              <Box
                sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.75 }}
              >
                <Link
                  href="/forgetPassword"
                  underline="hover"
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: FORGOT_BLUE,
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </Stack>

          {error ? (
            <Typography
              variant="body2"
              sx={{ color: '#B00020', fontWeight: 600, mt: 1 }}
            >
              {error}
            </Typography>
          ) : null}

          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            onClick={handleLogin}
            sx={{
              py: 1.35,
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: 2,
              bgcolor: BRAND_RED,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#9A1A1A',
                boxShadow: 'none',
              },
            }}
          >
            {loading ? 'Logging in…' : 'Log in'}
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 0.5 }}>
            <Divider sx={{ flex: 1, borderColor: 'rgba(0,0,0,0.08)' }} />
            <Typography
              variant="caption"
              sx={{
                color: LABEL_GRAY,
                fontWeight: 600,
                letterSpacing: '0.08em',
                whiteSpace: 'nowrap',
              }}
            >
              OR CONTINUE WITH
            </Typography>
            <Divider sx={{ flex: 1, borderColor: 'rgba(0,0,0,0.08)' }} />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            sx={{
              py: 1.25,
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: 2,
              color: '#3c4043',
              borderColor: '#dadce0',
              bgcolor: '#fff',
              '&:hover': {
                borderColor: '#dadce0',
                bgcolor: '#fafafa',
              },
            }}
          >
            {googleLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: '#495057' }}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              underline="hover"
              sx={{ fontWeight: 600, color: BRAND_RED }}
            >
              Sign Up
            </Link>
          </Typography>

          <Box
            onClick={() => router.push('/registerCompany')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: LAVENDER,
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              '&:hover': { bgcolor: '#E1E6F8' },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1,
                bgcolor: BANNER_ICON_BG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BusinessIcon sx={{ color: '#fff', fontSize: 26 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: '#283593', lineHeight: 1.35 }}
              >
                Register your company
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#5c6bc0', display: 'block', mt: 0.25 }}
              >
                Start managing your team today
              </Typography>
            </Box>
            <ArrowForwardIcon
              sx={{ color: '#283593', fontSize: 22, flexShrink: 0 }}
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default HomePage;
