
import { useState, useRef, useCallback } from 'react';
import { VoiceRecording } from '@/store/alarmStore';

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioUrl: string | null;
}

export const useVoiceRecording = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioUrl: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordingState(prev => ({
          ...prev,
          audioUrl,
          isRecording: false,
        }));

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      
      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        duration: 0,
      }));

      // Start timer (30 second max)
      timerRef.current = setInterval(() => {
        setRecordingState(prev => {
          const newDuration = prev.duration + 0.1;
          
          // Auto-stop at 30 seconds
          if (newDuration >= 30) {
            stopRecording();
            return prev;
          }
          
          return { ...prev, duration: newDuration };
        });
      }, 100);

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [recordingState.isRecording]);

  const resetRecording = useCallback(() => {
    if (recordingState.audioUrl) {
      URL.revokeObjectURL(recordingState.audioUrl);
    }
    
    setRecordingState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioUrl: null,
    });
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [recordingState.audioUrl]);

  const createVoiceRecording = useCallback((): VoiceRecording | null => {
    if (!recordingState.audioUrl) return null;

    // Convert URL back to Blob
    return fetch(recordingState.audioUrl)
      .then(response => response.blob())
      .then(blob => ({
        id: Date.now().toString(),
        audioBlob: blob,
        duration: recordingState.duration,
        createdAt: new Date(),
      }))
      .then(recording => {
        resetRecording();
        return recording;
      })
      .catch(() => null);
  }, [recordingState.audioUrl, recordingState.duration, resetRecording]);

  return {
    recordingState,
    startRecording,
    stopRecording,
    resetRecording,
    createVoiceRecording,
  };
};
