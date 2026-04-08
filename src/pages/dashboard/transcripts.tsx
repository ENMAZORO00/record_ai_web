'use client';

import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { NextPageWithLayout } from '../_app';
import { getDashboardLayout } from '@/src/lib/getDashboardLayout';
import { apiService } from '@/src/services/api';
import { FONTFAMILY } from '@/src/lib/constants/font';

interface Conversation {
  id: string;
  speaker: string;
  text: string;
  transcriptId: string;
}

interface Transcript {
  id: string;
  recordingUrl?: string;
  status: string;
  userId: string;
  meetingId?: string;
  createdAt: string;
  Conversation: Conversation[];
  isOwner?: boolean;
}

const Page: NextPageWithLayout = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Transcript | null>(null);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // FETCH TRANSCRIPTS
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      setLoading(true);
      const res = await apiService.getTranscripts(token);

      if (res.data) setTranscripts(res.data);
      setLoading(false);
    };

    fetchData();
  }, [token]);

  // SNAPSHOT TEXT (first 120 chars of conversation)
  const getPreview = (conversation: Conversation[] = []) => {
    if (!conversation || conversation.length === 0)
      return 'No transcript available';
    const joined = conversation.map((c) => c.text).join(' ');
    return joined.length > 120 ? joined.slice(0, 120) + '...' : joined;
  };

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        p: { xs: 2, sm: 4 },
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : transcripts.length === 0 ? (
        <Typography color="text.secondary">No transcripts found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {transcripts.map((t) => (
            <Grid
              sx={{
                width: '100%',
              }}
              key={t.id}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                }}
                onClick={() => setSelected(t)}
              >
                <CardContent>
                  {/* SNAPSHOT TEXT */}
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: FONTFAMILY.PRIMARY,
                      mb: 1,
                    }}
                  >
                    {getPreview(t.Conversation)}
                  </Typography>

                  {/* DATE + STATUS */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {new Date(t.createdAt).toDateString()}
                    </Typography>

                    <Chip
                      label={t.status || 'Completed'}
                      size="small"
                      color="success"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* MODAL */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          {/* HEADER */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Conversation</Typography>
            <IconButton onClick={() => setSelected(null)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {selected && (
            <>
              {/* AUDIO PLAYER */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f5f0ff',
                  mb: 3,
                }}
              >
                <PlayArrowIcon color="primary" />
                <audio controls style={{ width: '100%' }}>
                  <source src={selected.recordingUrl} />
                </audio>
              </Box>

              {/* TRANSCRIPT */}
              <Typography variant="subtitle2" mb={1}>
                Transcript
              </Typography>

              {selected.Conversation && selected.Conversation.length > 0 ? (
                <Box>
                  {selected.Conversation.map((c) => (
                    <Box key={c.id} mb={1}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {c.speaker}:
                      </Typography>{' '}
                      <Typography
                        variant="body2"
                        component="span"
                        sx={{ fontFamily: FONTFAMILY.PRIMARY }}
                      >
                        {c.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ fontFamily: FONTFAMILY.PRIMARY }}
                >
                  Transcript not ready
                </Typography>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return getDashboardLayout(page, { topBarTitle: 'Transcripts' });
};

export default Page;
