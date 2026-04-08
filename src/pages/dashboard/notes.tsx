'use client';

import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { getDashboardLayout } from '@/src/lib/getDashboardLayout';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { useRouter } from 'next/router';
import { apiService } from '@/src/services/api';
import { FONTFAMILY } from '@/src/lib/constants/font';

interface Info {
  id: string;
  title: string | null; // ✅ FIX
  text: string;
  createdAt: string;
}

function Page() {
  const router = useRouter();

  const [data, setData] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Info | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const [deleting, setDeleting] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return router.push('/');

        const res = await apiService.getInformation(token);
        if (res.error) throw new Error(res.error);

        setData(res.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // create
  const handleCreate = async () => {
    try {
      setCreating(true);
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token');

      const res = await apiService.createInformation({ title, text }, token);

      if (res.error) throw new Error(res.error);

      if (res.data) {
        setData((prev) => [res.data!, ...prev]);
      }

      // setData((prev) => [res.data, ...prev]);
      setAddOpen(false);
      setTitle('');
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setCreating(false);
    }
  };

  // delete
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this information?')) return;

    try {
      setDeleting(id);
      const token = localStorage.getItem('authToken');

      const res = await apiService.deleteInformation(id, token!);
      if (res.error) throw new Error(res.error);

      setData((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {error && <Alert severity="error">{error}</Alert>}

      {/* TOP BAR */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontFamily: FONTFAMILY.PRIMARY }}>
          Information
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddOpen(true)}
        >
          Add Information
        </Button>
      </Box>

      {/* EMPTY */}
      {data.length === 0 ? (
        <Typography>No information added yet</Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 2,
          }}
        >
          {data.map((item) => (
            <Card
              key={item.id}
              onClick={() => {
                setSelected(item);
                setViewOpen(true);
              }}
              sx={{
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
              }}
            >
              <CardContent>
                <Typography variant="h6">{item.title || 'Untitled'}</Typography>

                {/* GLIMPSE */}
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {item.text}
                </Typography>
              </CardContent>

              <CardActions>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  {deleting === item.id ? (
                    <CircularProgress size={18} />
                  ) : (
                    <DeleteIcon color="error" />
                  )}
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* VIEW MODAL */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth>
        <DialogTitle>{selected?.title || 'Untitled'}</DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {selected?.text}
          </Typography>
        </DialogContent>
      </Dialog>

      {/* ADD MODAL */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth>
        <DialogTitle>Add Information</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            sx={{ mb: 2 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            fullWidth
            label="Details"
            multiline
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={creating || !text}
          >
            {creating ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return getDashboardLayout(page);
};

export default Page;
