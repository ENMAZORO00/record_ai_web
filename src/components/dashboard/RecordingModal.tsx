import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CloseIcon from '@mui/icons-material/Close';

interface RecordingModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (audioBlob: Blob) => void;
  loading?: boolean;
}

const RecordingModal: React.FC<RecordingModalProps> = ({
  open,
  onClose,
  onSave,
  loading,
}) => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Hoist startRecording and stopTimer above useEffect to avoid TDZ error
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) setAudioChunks((prev) => [...prev, e.data]);
      };
      recorder.onstop = () => {
        stopTimer();
      };
      recorder.start();
      setRecording(true);
      setPaused(false);
      setTime(0);
    } catch {
      alert('Microphone access denied or not available.');
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      // Defer startRecording to avoid cascading renders
      setTimeout(() => {
        startRecording();
      }, 0);
    } else {
      stopTimer();
      setRecording(false);
      setPaused(false);
      setTime(0);
      setAudioChunks([]);
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
      setMediaRecorder(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mediaRecorder, startRecording]);

  useEffect(() => {
    if (recording && !paused) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [recording, paused]);

  // Duplicate declarations removed above

  const handlePause = () => {
    if (mediaRecorder && recording) {
      if (paused) {
        mediaRecorder.resume();
        setPaused(false);
      } else {
        mediaRecorder.pause();
        setPaused(true);
      }
    }
  };

  const handleStop = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      setPaused(false);
      stopTimer();
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      onSave(audioBlob);
    }
  };

  const handleClose = () => {
    if (mediaRecorder) {
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
    setPaused(false);
    setTime(0);
    setAudioChunks([]);
    onClose();
  };

  const formatTime = (t: number) => {
    const m = String(Math.floor(t / 60)).padStart(2, '0');
    const s = String(t % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0,0,0,0.18)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: 4,
          boxShadow: 3,
          p: { xs: 2, sm: 4 },
          minWidth: 320,
          maxWidth: '90vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 1, mt: 2, textAlign: 'center' }}
        >
          <FiberManualRecordIcon color="error" sx={{ mr: 1, fontSize: 22 }} />
          Recording
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ color: 'green', mb: 2, textAlign: 'center' }}
        >
          Live Recording
        </Typography>
        <Box
          sx={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6a8dff 0%, #7f53ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
            {formatTime(time)}
          </Typography>
        </Box>
        <Typography sx={{ mb: 3, color: '#444', fontSize: 15 }}>
          Your voice is being recorded...
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            justifyContent: 'center',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ bgcolor: '#ffeaea', color: '#e57373', width: 56, height: 56 }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={handlePause}
            sx={{
              bgcolor: '#7f53ff',
              color: '#fff',
              width: 56,
              height: 56,
              mx: 2,
            }}
          >
            <PauseIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={handleStop}
            sx={{ bgcolor: '#e0f7fa', color: '#0097a7', width: 56, height: 56 }}
          >
            <StopIcon fontSize="large" />
          </IconButton>
        </Box>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
      </Box>
    </Box>
  );
};

export default RecordingModal;
