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
} from '@mui/material';
import { useState } from 'react';

const PAGE_BG = '#F5F5F5';
const CARD_BG = '#FFFFFF';
const BRAND_RED = '#D32F2F';
const BRAND_RED_HOVER = '#C62828';
const INPUT_BG = '#F9F9F9';
const MUTED_GRAY = '#868E96';
const LINK_BLUE = '#1E40AF';
const LABEL_COLOR = '#212529';

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
  const [showPassword, setShowPassword] = useState(false);

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
                placeholder="Min. 8 characters"
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

          <Button
            fullWidth
            variant="contained"
            size="large"
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
              '&:hover': {
                bgcolor: BRAND_RED_HOVER,
                boxShadow: 'none',
              },
            }}
          >
            Continue
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
              sx={{ fontWeight: 700, color: LINK_BLUE }}
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
