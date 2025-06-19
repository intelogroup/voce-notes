
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CleanCard, CleanCardContent } from '@/components/ui/clean-card';
import { Mic, Square, Play, RotateCcw } from 'lucide-react';
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

  const startRecording = () => {
    setIsRecording(true);
    setDuration(0);
    // Simulate recording timer
    const timer = setInterval(() => {
      setDuration(prev => prev + 0.1);
    }, 100);
    
    // Simulate recording completion after 5 seconds for demo
    setTimeout(() => {
      setIsRecording(false);
      setAudioUrl('demo-audio-url');
      clearInterval(timer);
    }, 5000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const playRecording = () => {
    if (audioUrl) {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2000); // Simulate playback
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setDuration(0);
    setIsPlaying(false);
  };

  return (
    <CleanCard className={cn('w-full', className)}>
      <CleanCardContent className="p-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>Recording: {duration.toFixed(1)}s</span>
            </div>
          )}

          {/* Main Recording Button */}
          <Button
            onClick={isRecording ? stopRecording : audioUrl ? playRecording : startRecording}
            size="lg"
            variant={isRecording ? "destructive" : audioUrl ? "secondary" : "default"}
            className={cn(
              "h-16 w-16 rounded-full",
              isRecording && "animate-pulse"
            )}
          >
            {isRecording ? (
              <Square className="h-6 w-6" />
            ) : audioUrl ? (
              <Play className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>

          {/* Controls */}
          {audioUrl && !isRecording && (
            <div className="flex space-x-2">
              <Button
                onClick={resetRecording}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Re-record
              </Button>
            </div>
          )}

          {/* Status Text */}
          <p className="text-sm text-muted-foreground text-center">
            {isRecording ? 'Recording in progress...' : 
             audioUrl ? 'Tap to preview recording' : 
             'Tap to start recording'}
          </p>
        </div>
      </CleanCardContent>
    </CleanCard>
  );
};
