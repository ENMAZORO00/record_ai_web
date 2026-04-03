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
import { useState } from 'react';

const BG = '#F0F1F3';
const CARD = '#FFFFFF';
const BRAND_RED = '#D32F2F';
const BRAND_RED_DEEP = '#B21E1E';
const INPUT_BG = '#F1F3F5';
const MUTED_GRAY = '#868E96';

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
    borderRadius: '10px',
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
  '& .MuiFilledInput-input::placeholder': {
    color: MUTED_GRAY,
    opacity: 1,
  },
} as const;

function FieldLabel({ children }: { children: string }) {
  return (
    <Typography
      component="label"
      variant="body2"
      sx={{
        display: 'block',
        fontWeight: 700,
        color: '#212529',
        mb: 0.75,
        fontSize: '0.8125rem',
      }}
    >
      {children}
    </Typography>
  );
}

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);

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
        }}
      >
        SHOTEN AICORE — V2.4.0
      </Typography>

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: CARD,
          borderRadius: '24px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
          px: { xs: 2.5, sm: 4 },
          py: { xs: 3.5, sm: 4.5 },
        }}
      >
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
              Create Account
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: MUTED_GRAY, lineHeight: 1.5 }}
            >
              Join Shoten AI to start your creative journey
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            sx={{
              py: 1.25,
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: 9999,
              color: '#212529',
              borderColor: '#E0E0E0',
              bgcolor: '#fff',
              '&:hover': {
                borderColor: '#D0D0D0',
                bgcolor: '#FAFAFA',
              },
            }}
          >
            Continue with Google
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Divider sx={{ flex: 1, borderColor: 'rgba(0,0,0,0.1)' }} />
            <Typography
              variant="caption"
              sx={{
                color: MUTED_GRAY,
                fontWeight: 600,
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
              }}
            >
              OR
            </Typography>
            <Divider sx={{ flex: 1, borderColor: 'rgba(0,0,0,0.1)' }} />
          </Box>

          <Stack spacing={2}>
            <Box>
              <FieldLabel>Full Name</FieldLabel>
              <TextField
                fullWidth
                variant="filled"
                hiddenLabel
                placeholder="Enter your full name"
                InputProps={{ disableUnderline: true }}
                sx={fieldSx}
              />
            </Box>

            <Box>
              <FieldLabel>Email Address</FieldLabel>
              <TextField
                fullWidth
                variant="filled"
                hiddenLabel
                type="email"
                placeholder="name@company.com"
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
                placeholder="Min. 8 characters"
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
                        sx={{ color: MUTED_GRAY }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />
            </Box>
          </Stack>
          {/*  */}

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: 9999,
              color: '#fff',
              background: `linear-gradient(180deg, ${BRAND_RED} 0%, ${BRAND_RED_DEEP} 100%)`,
              boxShadow: '0 10px 28px rgba(178, 30, 30, 0.45)',
              '&:hover': {
                background: `linear-gradient(180deg, #C62828 0%, #9A1818 100%)`,
                boxShadow: '0 12px 32px rgba(178, 30, 30, 0.5)',
              },
            }}
          >
            Create Account
          </Button>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: '#495057' }}
          >
            Already have an account?{' '}
            <Link
              href="/"
              underline="hover"
              sx={{ fontWeight: 700, color: BRAND_RED_DEEP }}
            >
              Sign In
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SignUpPage;
