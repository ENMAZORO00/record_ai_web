import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, Button, InputAdornment, Link, Paper, Stack, TextField, Typography } from '@mui/material';

const BG = '#F0F1F3';
const CARD = '#FFFFFF';
const BRAND_RED = '#D32F2F';
const BRAND_RED_DEEP = '#B21E1E';
const MUTED_GRAY = '#868E96';
const LINK_BLUE = '#1E40AF';

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

const ForgetPassword = () => {
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
          background:
            'radial-gradient(ellipse 120% 80% at 50% 20%, rgba(255,255,255,0.85) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 80% 75%, rgba(255,255,255,0.5) 0%, transparent 45%)',
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
          borderRadius: '16px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
          px: { xs: 2.5, sm: 5 },
          py: { xs: 3.5, sm: 5 },
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
                mb: 1.5,
              }}
            >
              Forgot password?
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: MUTED_GRAY, lineHeight: 1.6, px: { xs: 0, sm: 0.5 } }}
            >
              Enter the email linked to your account. We&apos;ll send you a verification code to reset
              your password.
            </Typography>
          </Box>

          <Box>
            <FieldLabel>Email Address</FieldLabel>
            <TextField
              fullWidth
              type="email"
              placeholder="Email Address"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon sx={{ color: MUTED_GRAY, fontSize: 22 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  bgcolor: '#fff',
                  '& fieldset': {
                    borderColor: '#E0E0E0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D0D0D0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: BRAND_RED,
                    borderWidth: 1,
                  },
                },
                '& .MuiOutlinedInput-input': {
                  py: 1.75,
                  fontSize: '0.95rem',
                  '&::placeholder': {
                    color: MUTED_GRAY,
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 20 }} />}
            sx={{
              mt: 0.5,
              py: 1.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: 9999,
              color: '#fff',
              background: `linear-gradient(90deg, ${BRAND_RED_DEEP} 0%, ${BRAND_RED} 100%)`,
              boxShadow: '0 10px 28px rgba(178, 30, 30, 0.45)',
              '&:hover': {
                background: `linear-gradient(90deg, #9A1818 0%, #C62828 100%)`,
                boxShadow: '0 12px 32px rgba(178, 30, 30, 0.5)',
              },
            }}
          >
            Send Reset Code
          </Button>

          <Box sx={{ textAlign: 'center', pt: 0.5 }}>
            <Link
              href="/"
              underline="none"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.25,
                color: LINK_BLUE,
                fontWeight: 500,
                fontSize: '0.95rem',
                '&:hover': {
                  color: '#1D4ED8',
                },
              }}
            >
              <Box component="span" sx={{ fontSize: '1.1rem', lineHeight: 1 }}>
                ←
              </Box>
              Back to Sign In
            </Link>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ForgetPassword;
