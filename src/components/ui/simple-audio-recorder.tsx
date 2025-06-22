import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CleanCard, CleanCardContent } from '@/components/ui/clean-card';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, Play, Pause, RotateCcw, Download, Timer, MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useSettingsStore } from '@/store/settingsStore';

interface SimpleAudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  onCancel?: () => void;
  className?: string;
}

export const SimpleAudioRecorder: React.FC<SimpleAudioRecorderProps> = ({
  onRecordingComplete,
  onCancel,
  className
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  
  const { highQualityAudio, noiseCancellation } = useSettingsStore();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const audioConstraints: MediaTrackConstraints = {
        noiseSuppression: noiseCancellation,
        echoCancellation: highQualityAudio,
        autoGainControl: !highQualityAudio,
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        if (onRecordingComplete) {
          onRecordingComplete(blob, duration);
        }
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 0.1);
      }, 100);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handlePlayback = () => {
    if (audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current) {
          audioRef.current = new Audio(audioUrl);
          audioRef.current.onended = () => {
            setIsPlaying(false);
            setPlaybackProgress(0);
          };
          audioRef.current.ontimeupdate = () => {
            if (audioRef.current) {
              const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
              setPlaybackProgress(progress);
            }
          };
        }
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setDuration(0);
    setIsPlaying(false);
    setPlaybackProgress(0);
    if(onCancel) {
      onCancel();
    }
  };

  const downloadRecording = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `recording-${new Date().toISOString()}.wav`;
      a.click();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <CleanCard className={cn('w-full', className)}>
        <CleanCardContent className="p-6">
          <div className="space-y-4">
            {/* Status Display */}
            <div className="text-center">
              {isRecording ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-red-600">Recording</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatDuration(duration)}
                  </div>
                </div>
              ) : audioUrl ? (
                <div className="space-y-3">
                  <div className="text-lg font-medium text-foreground">
                    Recording Complete
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration: {formatDuration(duration)}
                  </div>
                  {isPlaying && (
                    <Progress 
                      value={playbackProgress} 
                      className="w-full h-1"
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Mic className="w-8 h-8 mx-auto text-muted-foreground" />
                  <div className="text-lg font-medium text-foreground">
                    Ready to Record
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {!isRecording && !audioUrl && (
                <Button
                  onClick={startRecording}
                  size="lg"
                  className="h-20 flex-1 flex-col"
                >
                  <Timer className="w-6 h-6 mb-1" />
                  <span>Start Recording</span>
                </Button>
              )}

              {isRecording && (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  size="lg"
                  className="h-12 px-6"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              )}

              {audioUrl && (
                <>
                  <Button
                    onClick={handlePlayback}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>

                  <Button
                    onClick={resetRecording}
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12"
                  >
                    <RotateCcw className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </>
              )}
            </div>

            {/* Save Button - only appears when a recording is complete */}
            {audioUrl && !isRecording && (
              <div className='pt-4'>
                <Button 
                  onClick={() => {
                    if(onRecordingComplete && audioUrl) {
                       fetch(audioUrl).then(res => res.blob()).then(blob => {
                           onRecordingComplete(blob, duration);
                       })
                    }
                  }}
                  size="lg"
                  className="w-full"
                >
                  Save Note
                </Button>
              </div>
            )}
          </div>
        </CleanCardContent>
      </CleanCard>
    </>
  );
};
