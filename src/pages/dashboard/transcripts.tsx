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
  Button,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const [shares, setShares] = useState<{ email: string; name: string }[]>([]);
  const [shareEmail, setShareEmail] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  // FETCH
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLoading(true);
      const res = await apiService.getTranscripts(token);
      if (res.data) {
        setTranscripts(res.data);
        setAllTranscripts(res.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  // SEARCH
  useEffect(() => {
    if (!token) return;

    const delay = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setTranscripts(allTranscripts);
        return;
      }

      setSearchLoading(true);
      const res = await apiService.searchTranscripts(searchQuery, token);
      if (res.data) setTranscripts(res.data);
      setSearchLoading(false);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery, token, allTranscripts]);

  // LOAD SHARES
  useEffect(() => {
    const loadShares = async () => {
      if (!selected || !token || selected.isOwner === false) return;

      const res = await apiService.getTranscriptShares(selected.id, token);
      if (res.data) setShares(res.data);
    };

    loadShares();
  }, [selected, token]);

  // PREVIEW
  const getPreview = (conversation: Conversation[] = []) => {
    if (!conversation?.length) return 'No transcript available';
    const text = conversation.map((c) => c.text).join(' ');
    return text.length > 120 ? text.slice(0, 120) + '...' : text;
  };

  // SHARE
  const handleShare = async () => {
    if (!selected || !token || !shareEmail.trim()) return;

    setShareLoading(true);
    setShareError(null);

    const res = await apiService.shareTranscript(
      selected.id,
      shareEmail.trim(),
      token
    );

    if (res.error) {
      setShareError(res.error);
    } else {
      setShareEmail('');
      const updated = await apiService.getTranscriptShares(selected.id, token);
      if (updated.data) setShares(updated.data);
    }

    setShareLoading(false);
  };

  // DELETE
  const handleDelete = async () => {
    if (!selected || !token) return;

    const confirm = window.confirm('Delete this transcript?');
    if (!confirm) return;

    setDeleting(true);

    await apiService.deleteTranscript(selected.id, token);

    setTranscripts((prev) => prev.filter((t) => t.id !== selected.id));
    setAllTranscripts((prev) => prev.filter((t) => t.id !== selected.id));

    setSelected(null);
    setDeleting(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* SEARCH */}
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
        sx={{ mb: 3 }}
      />

      {/* LIST */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {transcripts.map((t) => (
            <Grid
              key={t.id}
              sx={{
                width: '100%',
              }}
            >
              <Card onClick={() => setSelected(t)} sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Typography sx={{ fontFamily: FONTFAMILY.PRIMARY }}>
                    {getPreview(t.Conversation)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* MODAL */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth>
        <DialogContent>
          {selected && (
            <>
              {/* TRANSCRIPT */}
              <Typography variant="h6" mb={2}>
                Transcript
              </Typography>

              {selected.Conversation.map((c) => (
                <Box key={c.id} mb={2}>
                  <Typography
                    sx={{
                      color: '#7c3aed',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {c.speaker}
                  </Typography>

                  <Typography sx={{ fontSize: 15 }}>{c.text}</Typography>
                </Box>
              ))}

              {/* SHARE BOX */}
              {selected.isOwner !== false && (
                <Box
                  mt={3}
                  sx={{
                    background: '#f3e8ff',
                    borderRadius: 3,
                    p: 2,
                    border: '1px solid #e9d5ff',
                  }}
                >
                  <Typography fontWeight={600}>Share with others</Typography>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Share with up to 3 people. They can view, listen, and chat
                    with this transcript.
                  </Typography>

                  <Box display="flex" gap={1}>
                    <TextField
                      fullWidth
                      placeholder="Enter email address"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      size="small"
                      sx={{
                        background: '#fff',
                        borderRadius: 2,
                      }}
                    />

                    <Button
                      variant="contained"
                      onClick={handleShare}
                      sx={{
                        background: '#a855f7',
                        borderRadius: 2,
                        px: 3,
                      }}
                    >
                      Add
                    </Button>
                  </Box>

                  {shareError && (
                    <Typography color="error" mt={1}>
                      {shareError}
                    </Typography>
                  )}
                </Box>
              )}

              {/* DELETE BUTTON */}
              {selected.isOwner !== false && (
                <Button
                  fullWidth
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{
                    mt: 3,
                    background: '#dc2626',
                    color: '#fff',
                    borderRadius: 2,
                    py: 1.5,
                    '&:hover': { background: '#b91c1c' },
                  }}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
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
