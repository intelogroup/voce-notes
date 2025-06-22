import { useState, useRef, useCallback } from 'react';
import { VoiceRecording } from '@/store/alarmStore';

export interface RecordingState {
  isRecording: boolean;
  duration: number;
  audioUrl: string | null;
  transcribedText: string | null;
  isTranscribing: boolean;
}

// Check for SpeechRecognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
}

export const useVoiceRecording = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    duration: 0,
    audioUrl: null,
    transcribedText: null,
    isTranscribing: false,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const resetState = useCallback(() => {
    if (recordingState.audioUrl) {
      URL.revokeObjectURL(recordingState.audioUrl);
    }
    setRecordingState({
      isRecording: false,
      duration: 0,
      audioUrl: null,
      transcribedText: null,
      isTranscribing: false,
    });
  }, [recordingState.audioUrl]);

  const startRecording = useCallback(async () => {
    resetState();
    if (!navigator.mediaDevices || !recognition) {
      console.error("Browser does not support required APIs");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordingState(prev => ({ ...prev, audioUrl, isRecording: false, isTranscribing: true }));
        
        if (recognition) {
            recognition.start();
        }

        streamRef.current?.getTracks().forEach(track => track.stop());
      };
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setRecordingState(prev => ({...prev, transcribedText: finalTranscript || interimTranscript}));
      };

      recognition.onend = () => {
        setRecordingState(prev => ({...prev, isTranscribing: false}));
        recognition.stop();
      };

      mediaRecorder.start();
      setRecordingState(prev => ({ ...prev, isRecording: true, duration: 0 }));

      timerRef.current = setInterval(() => {
        setRecordingState(prev => ({ ...prev, duration: prev.duration + 0.1 }));
      }, 100);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      resetState();
    }
  }, [resetState]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [recordingState.isRecording]);

  const createVoiceRecording = useCallback(async (): Promise<VoiceRecording | null> => {
    if (!recordingState.audioUrl) return null;

    try {
      // Convert URL back to Blob
      const response = await fetch(recordingState.audioUrl);
      const blob = await response.blob();
      
      const recording: VoiceRecording = {
        id: Date.now().toString(),
        audioBlob: blob,
        duration: recordingState.duration,
        createdAt: new Date(),
      };
      
      resetState();
      return recording;
    } catch (error) {
      console.error('Error creating voice recording:', error);
      return null;
    }
  }, [recordingState.audioUrl, recordingState.duration, resetState]);

  return {
    recordingState,
    startRecording,
    stopRecording,
    resetRecording: resetState,
    createVoiceRecording,
  };
};
