import {
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  Paper,
  Stack,
  useTheme,
  IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { apiService } from '@/src/services/api';
import MicIcon from '@mui/icons-material/Mic';

type Member = {
  id: string;
  name: string;
  email: string;
  companyRole: string;
  isCurrentUser: boolean;
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }
      const res = await apiService.getCompanyMembers(token);
      if (res.error) {
        setError(res.error);
      } else {
        setMembers(res.data?.members || []);
      }
      setLoading(false);
    };
    fetchMembers();
  }, []);
  [
    {
      resource:
        '/home/shubham/Desktop/Record Ai/record_web/shotenweb/src/services/api.ts',
      owner: 'typescript',
      code: '1434',
      severity: 8,
      message: 'Unexpected keyword or identifier.',
      source: 'ts',
      startLineNumber: 2,
      startColumn: 5,
      endLineNumber: 2,
      endColumn: 10,
      modelVersionId: 1,
      origin: 'extHost1',
    },
    {
      resource:
        '/home/shubham/Desktop/Record Ai/record_web/shotenweb/src/services/api.ts',
      owner: 'typescript',
      code: '1005',
      severity: 8,
      message: "',' expected.",
      source: 'ts',
      startLineNumber: 2,
      startColumn: 34,
      endLineNumber: 2,
      endColumn: 35,
      modelVersionId: 1,
      origin: 'extHost1',
    },
    {
      resource:
        '/home/shubham/Desktop/Record Ai/record_web/shotenweb/src/services/api.ts',
      owner: 'typescript',
      code: '1005',
      severity: 8,
      message: "';' expected.",
      source: 'ts',
      startLineNumber: 2,
      startColumn: 44,
      endLineNumber: 2,
      endColumn: 45,
      modelVersionId: 1,
      origin: 'extHost1',
    },
  ];
  const handleSelectMember = (id: string) => {
    setSelectedMemberId(id === selectedMemberId ? null : id);
  };

  const handleStartRecording = () => {
    // TODO: Implement actual recording logic
    if (selectedMemberId) {
      alert(
        'Start recording with member: ' +
          members.find((m) => m.id === selectedMemberId)?.name
      );
    } else {
      alert('Start solo recording');
    }
  };

  return (
    <Box sx={{ p: { xs: 0.5, sm: 2 }, width: '100%' }}>
      <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
        Select colleagues to record with, then start recording.
      </Typography>

      <Button
        variant="outlined"
        color="inherit"
        startIcon={<MicIcon />}
        sx={{
          bgcolor: '#fff',
          color: '#333',
          fontWeight: 500,
          fontSize: '1.05rem',
          px: 4,
          py: 1.3,
          mb: 3,
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #d1d5db',
          '&:hover': {
            bgcolor: '#f3f4f6',
            color: '#222',
            border: '1px solid #bdbdbd',
          },
        }}
        onClick={handleStartRecording}
      >
        Start solo recording
      </Button>

      <Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: 'center', py: 4 }}>
            {error}
          </Typography>
        ) : (
          <Stack spacing={2}>
            {members.map((member) => {
              const isSelected = selectedMemberId === member.id;
              const isCurrentUser = member.isCurrentUser;
              return (
                <Paper
                  key={member.id}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 2,
                    borderRadius: 2,
                    border: isSelected
                      ? '2px solid #bdbdbd'
                      : '1px solid #e0e0e0',
                    cursor: isCurrentUser ? 'default' : 'pointer',
                    opacity: isCurrentUser ? 0.7 : 1,
                    background: isSelected ? '#f3f4f6' : '#fff',
                    transition: 'border 0.2s, background 0.2s',
                  }}
                  onClick={() =>
                    !isCurrentUser && handleSelectMember(member.id)
                  }
                >
                  <Avatar
                    sx={{
                      bgcolor: '#e0e0e0',
                      color: '#555',
                      width: 44,
                      height: 44,
                      fontWeight: 600,
                      fontSize: 22,
                      mr: 2,
                    }}
                  >
                    {member.name?.[0]?.toUpperCase() ||
                      member.email[0]?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={600} fontSize={18}>
                      {member.name}
                      {member.isCurrentUser && (
                        <Typography
                          component="span"
                          sx={{
                            fontWeight: 400,
                            fontSize: 14,
                            color: 'text.secondary',
                            ml: 1,
                          }}
                        >
                          (Admin) (You)
                        </Typography>
                      )}
                      {member.companyRole === 'admin' &&
                        !member.isCurrentUser && (
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 400,
                              fontSize: 14,
                              color: 'text.secondary',
                              ml: 1,
                            }}
                          >
                            (Admin)
                          </Typography>
                        )}
                    </Typography>
                    <Typography color="text.secondary" fontSize={15}>
                      {member.email}
                    </Typography>
                  </Box>
                  {!member.isCurrentUser && (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: isSelected
                          ? '2px solid #bdbdbd'
                          : '2px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ml: 2,
                        bgcolor: isSelected ? '#e0e0e0' : '#f5f5f5',
                        transition: 'border 0.2s, background 0.2s',
                      }}
                    >
                      {isSelected ? (
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            bgcolor: '#bdbdbd',
                          }}
                        />
                      ) : null}
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
