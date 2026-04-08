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
  TextField,
  InputAdornment,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
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
  const [allTranscripts, setAllTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Transcript | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // ✅ FETCH ALL TRANSCRIPTS
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      setLoading(true);
      const res = await apiService.getTranscripts(token);

      if (res.data) {
        setTranscripts(res.data);
        setAllTranscripts(res.data); // store original list
      }

      setLoading(false);
    };

    fetchData();
  }, [token]);

  // ✅ DEBOUNCED SEARCH
  useEffect(() => {
    if (!token) return;

    const delayDebounce = setTimeout(async () => {
      // if search empty → show all
      if (searchQuery.trim() === '') {
        setTranscripts(allTranscripts);
        return;
      }

      setSearchLoading(true);

      const res = await apiService.searchTranscripts(searchQuery, token);

      if (res.data) {
        setTranscripts(res.data); // only matched transcripts
      }

      setSearchLoading(false);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, token, allTranscripts]);

  // SNAPSHOT TEXT
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
      {/* ✅ SEARCH BAR */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search or describe what you're looking for"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchLoading && <CircularProgress size={18} />,
          }}
        />
      </Box>

      {/* ✅ CONTENT */}
      {loading ? (
        <CircularProgress />
      ) : transcripts.length === 0 ? (
        <Typography color="text.secondary">
          No matching transcripts found.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {transcripts.map((t) => (
            <Grid key={t.id} sx={{ width: '100%' }}>
              <Card
                sx={{ cursor: 'pointer', borderRadius: 3 }}
                onClick={() => setSelected(t)}
              >
                <CardContent>
                  {/* PREVIEW */}
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

      {/* ✅ MODAL */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Conversation</Typography>
            <IconButton onClick={() => setSelected(null)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {selected && (
            <>
              {/* AUDIO */}
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

              {selected.Conversation?.length > 0 ? (
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
