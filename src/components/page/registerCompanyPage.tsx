'use client';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Security from '@mui/icons-material/Security';
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
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiService } from '@/src/services/api';

const PAGE_BG = '#F5F5F5';
const CARD_BG = '#FFFFFF';
const BRAND_RED = '#D32F2F';
const BRAND_RED_HOVER = '#C62828';
const INPUT_BG = '#F9F9F9';
const MUTED_GRAY = '#868E96';
const LINK_BLUE = '#1E40AF';
const LABEL_COLOR = '#212529';
const ERROR_RED = '#D32F2F';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: INPUT_BG,
    borderRadius: '8px',
    fontSize: '0.95rem',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.06)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.08)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.12)',
      borderWidth: '1px',
    },
  },
  '& .MuiOutlinedInput-input': {
    py: 1.5,
    '&::placeholder': {
      color: MUTED_GRAY,
      opacity: 1,
    },
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
        color: LABEL_COLOR,
        mb: 0.75,
        fontSize: '0.8125rem',
      }}
    >
      {children}
    </Typography>
  );
}

const RegisterCompanyPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    adminEmail: '',
    adminName: '',
    password: '',
  });

  // Input change handler
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Validation helper
  const validateForm = (): boolean => {
    const { companyName, adminEmail, adminName, password } = formData;

    if (!companyName.trim()) {
      setError('Please enter your company name');
      return false;
    }

    if (!adminEmail.trim()) {
      setError('Please enter admin email');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!adminName.trim()) {
      setError('Please enter your name');
      return false;
    }

    if (!password) {
      setError('Please enter a password');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  // Handle continue button click
  const handleContinue = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Call signup API
      const signupResponse = await apiService.signup(
        formData.adminName.trim(),
        formData.adminEmail.trim().toLowerCase(),
        formData.password
      );

      if (signupResponse.error) {
        // If email already registered, try to register company directly
        if (signupResponse.error === 'Email already registered') {
          const registerResponse = await apiService.registerCompanyPublic(
            formData.adminEmail.trim().toLowerCase(),
            formData.companyName.trim()
          );

          if (registerResponse.error) {
            setError(registerResponse.error || 'Failed to register company');
            setLoading(false);
            return;
          }

          // Navigate to the app dashboard after company registration
          router.push('/dashboard');
          return;
        } else {
          setError(signupResponse.error || 'Failed to create account');
          setLoading(false);
          return;
        }
      }

      // For new users, navigate to verify OTP page with company registration data
      router.push(
        `/verifyCompany?email=${encodeURIComponent(
          formData.adminEmail.trim().toLowerCase()
        )}&name=${encodeURIComponent(
          formData.adminName.trim()
        )}&password=${encodeURIComponent(
          formData.password
        )}&companyName=${encodeURIComponent(formData.companyName.trim())}`
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'An unexpected error occurred. Please try again.';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleContinue();
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100dvh - 72px)',
        width: '100%',
        bgcolor: PAGE_BG,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
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
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            px: { xs: 2.5, sm: 4 },
            py: { xs: 3.5, sm: 4 },
          }}
        >
          <Stack spacing={2.5} alignItems="stretch">
            <Box textAlign="center">
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: LABEL_COLOR,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.375rem', sm: '1.5rem' },
                  mb: 1,
                }}
              >
                Register your company
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: MUTED_GRAY, lineHeight: 1.5 }}
              >
                Enter your details to create an account
              </Typography>
            </Box>

            <Stack spacing={2}>
              <Box>
                <FieldLabel>Company name</FieldLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  hiddenLabel
                  placeholder="Acme Corp"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange('companyName', e.target.value)
                  }
                  disabled={loading}
                  onKeyPress={handleKeyPress}
                  sx={fieldSx}
                />
              </Box>

              <Box>
                <FieldLabel>Admin email</FieldLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  hiddenLabel
                  type="email"
                  placeholder="admin@company.com"
                  value={formData.adminEmail}
                  onChange={(e) =>
                    handleInputChange('adminEmail', e.target.value)
                  }
                  disabled={loading}
                  onKeyPress={handleKeyPress}
                  sx={fieldSx}
                />
              </Box>

              <Box>
                <FieldLabel>Your name</FieldLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  hiddenLabel
                  placeholder="John Doe"
                  value={formData.adminName}
                  onChange={(e) =>
                    handleInputChange('adminName', e.target.value)
                  }
                  disabled={loading}
                  onKeyPress={handleKeyPress}
                  sx={fieldSx}
                />
              </Box>

              <Box>
                <FieldLabel>Password</FieldLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  hiddenLabel
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  disabled={loading}
                  onKeyPress={handleKeyPress}
                  InputProps={{
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
                          disabled={loading}
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

            {/* Error message */}
            {error && (
              <Typography
                sx={{
                  color: ERROR_RED,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  p: 1,
                  bgcolor: 'rgba(211, 47, 47, 0.08)',
                  borderRadius: '6px',
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
              onClick={handleContinue}
              sx={{
                mt: 0.5,
                py: 1.5,
                fontWeight: 700,
                fontSize: '0.95rem',
                textTransform: 'none',
                borderRadius: '50px',
                color: '#fff',
                bgcolor: BRAND_RED,
                boxShadow: 'none',
                position: 'relative',
                '&:hover': {
                  bgcolor: BRAND_RED_HOVER,
                  boxShadow: 'none',
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
                  Creating account...
                </Box>
              ) : (
                'Continue'
              )}
            </Button>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ color: '#495057', pt: 0.5 }}
            >
              Already have an account?{' '}
              <Link
                href="/"
                underline="hover"
                sx={{ fontWeight: 700, color: LINK_BLUE, cursor: 'pointer' }}
              >
                Log in
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          pb: 3,
          color: MUTED_GRAY,
        }}
      >
        <Security sx={{ fontSize: 16, opacity: 0.85 }} aria-hidden />
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
          }}
        >
          SECURE REGISTRATION
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterCompanyPage;
