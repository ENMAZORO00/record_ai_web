'use client';

import {
  Box,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MicIcon from '@mui/icons-material/Mic';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import StopIcon from '@mui/icons-material/Stop';

import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useChatThreads } from '@/src/contexts/ChatThreadsContext';
import { FONTFAMILY } from '@/src/lib/constants/font';
import { apiService } from '@/src/services/api';

const USER_FIRST_NAME = 'Shubham';

export default function DashboardAssistantHome() {
  const router = useRouter();
  const { createThreadWithUserMessage } = useChatThreads();

  const [message, setMessage] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------- SEND TEXT ----------------
  const send = useCallback(() => {
    const text = message.trim();
    if (!text) return;
    const id = createThreadWithUserMessage(text);
    setMessage('');
    router.push(`/dashboard/chat/${id}`);
  }, [message, createThreadWithUserMessage, router]);

  // ---------------- TIMER ----------------
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // ---------------- START RECORDING ----------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setSeconds(0);
    } catch {
      alert('Microphone permission denied');
    }
  };

  // ---------------- PAUSE / RESUME ----------------
  const togglePause = () => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
    } else {
      mediaRecorderRef.current.pause();
    }

    setIsPaused(!isPaused);
  };

  // ---------------- CANCEL ----------------
  const cancelRecording = () => {
    mediaRecorderRef.current?.stop();
    resetRecording();
  };

  // ---------------- SAVE ----------------
  const saveRecording = async () => {
    if (!mediaRecorderRef.current) return;

    setLoading(true);

    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });

      try {
        const token = localStorage.getItem('authToken');

        const response = await apiService.uploadRecording(
          blob,
          token || undefined
        );

        if (response.error) {
          throw new Error(response.error);
        }

        // ✅ If you don't need data, just don't destructure it
        // const { data } = response; ← optional if needed later

        resetRecording();
        alert('Uploaded successfully 🎉');
      } catch (err: unknown) {
        // ✅ Proper type-safe error handling
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert('Upload failed');
        }
      } finally {
        setLoading(false);
      }
    };
  };

  const resetRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setSeconds(0);
    chunksRef.current = [];
  };

  // ---------------- UI ----------------
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 5,
      }}
    >
      {!isRecording ? (
        // ---------------- DEFAULT SCREEN ----------------
        <Box textAlign="center" maxWidth={720} width="100%">
          <Typography
            variant="h4"
            sx={{ fontFamily: FONTFAMILY.PRIMARY, fontWeight: 700 }}
          >
            Hi, {USER_FIRST_NAME}!
          </Typography>

          <Typography color="#90A4AE" mt={1} mb={5} fontSize={28}>
            How can I help you?
          </Typography>

          <IconButton
            onClick={startRecording}
            sx={{
              width: 90,
              height: 90,
              bgcolor: 'primary.main',
              color: '#fff',
              boxShadow: 5,
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.05)',
              },
            }}
          >
            <MicIcon sx={{ fontSize: 40 }} />
          </IconButton>

          <Typography mt={1.5} color="primary.main" fontWeight={600}>
            Start Recording
          </Typography>

          <TextField
            fullWidth
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            sx={{ mt: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FormatListBulletedIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={send} disabled={!message.trim()}>
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      ) : (
        // ---------------- RECORDING SCREEN ----------------
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            mx: 'auto',
            p: 4,
            borderRadius: 5,
            backdropFilter: 'blur(20px)',
            background: 'rgba(255,255,255,0.7)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <Typography fontWeight={700} fontSize={20}>
            🎙 Recording
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: 14,
              color: isPaused ? 'warning.main' : 'success.main',
              fontWeight: 600,
            }}
          >
            {isPaused ? 'Paused' : 'Live Recording'}
          </Typography>

          <Box
            sx={{
              mt: 5,
              mb: 4,
              width: 200,
              height: 200,
              mx: 'auto',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'linear-gradient(135deg, #42a5f5 0%, #7e57c2 100%)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              animation: isPaused ? 'none' : 'pulse 1.6s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.08)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          >
            <Typography fontSize={34} color="#fff" fontWeight={800}>
              {formatTime(seconds)}
            </Typography>
          </Box>

          <Typography fontSize={14} color="text.secondary">
            {isPaused
              ? 'Recording paused. Tap resume to continue.'
              : 'Your voice is being recorded...'}
          </Typography>

          <Box
            sx={{
              mt: 5,
              px: 2,
              py: 2,
              borderRadius: 4,
              display: 'flex',
              justifyContent: 'space-around',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            }}
          >
            <IconButton
              onClick={cancelRecording}
              sx={{
                width: 60,
                height: 60,
                bgcolor: '#ffebee',
                color: '#d32f2f',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            >
              <CloseIcon />
            </IconButton>

            <IconButton
              onClick={togglePause}
              sx={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #5c6bc0, #7e57c2)',
                color: '#fff',
                boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                '&:hover': { transform: 'scale(1.08)' },
              }}
            >
              {isPaused ? (
                <PlayArrowIcon sx={{ fontSize: 36 }} />
              ) : (
                <PauseIcon sx={{ fontSize: 32 }} />
              )}
            </IconButton>

            <IconButton
              onClick={saveRecording}
              disabled={loading}
              sx={{
                width: 60,
                height: 60,
                bgcolor: '#e0f2f1',
                color: '#00796b',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            >
              {loading ? <CircularProgress size={22} /> : <StopIcon />}
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
}
