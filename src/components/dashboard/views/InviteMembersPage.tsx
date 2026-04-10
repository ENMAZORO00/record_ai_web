import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import { useState } from 'react';
import { apiService } from '../../../services/api';

export default function InviteMembersPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get token from localStorage (assumes user is logged in)
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    try {
      const res = await apiService.request<{ message: string; email: string }>(
        '/companies/invites',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(
          'Invitation sent! Login details will be emailed to the user.'
        );
        setEmail('');
      }
    } catch (err) {
      setError('Failed to send invite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        bgcolor: '#F7F8FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={1} align="center">
          Invite Team Member
        </Typography>
        <Typography color="text.secondary" mb={2} align="center">
          Enter the email address of the person you want to invite. They will
          receive login credentials by email.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box component="form" onSubmit={handleInvite}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
              size="medium"
              sx={{ borderRadius: 2, bgcolor: '#FAFAFA' }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                borderRadius: 9999,
                fontWeight: 700,
                py: 1.3,
                fontSize: '1rem',
                boxShadow: '0 4px 16px rgba(211,47,47,0.10)',
              }}
              fullWidth
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
