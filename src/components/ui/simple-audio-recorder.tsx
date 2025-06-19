
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CleanCard, CleanCardContent } from '@/components/ui/clean-card';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, Play, Pause, RotateCcw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimpleAudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  className?: string;
}

export const SimpleAudioRecorder: React.FC<SimpleAudioRecorderProps> = ({
  onRecordingComplete,
  className
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        onRecordingComplete?.(blob);
        
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
          <div className="flex justify-center gap-2">
            {!isRecording && !audioUrl && (
              <Button
                onClick={startRecording}
                size="lg"
                className="h-12 px-6"
              >
                <Mic className="w-4 h-4 mr-2" />
                Record
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
                  size="lg"
                  className="h-12 px-4"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  onClick={resetRecording}
                  variant="outline"
                  size="lg"
                  className="h-12 px-4"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  onClick={downloadRecording}
                  variant="outline"
                  size="lg"
                  className="h-12 px-4"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CleanCardContent>
    </CleanCard>
  );
};
