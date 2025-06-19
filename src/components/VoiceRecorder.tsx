
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CleanCard, CleanCardContent } from '@/components/ui/clean-card';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, Play, Pause, RotateCcw, Check, Volume2 } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { VoiceRecording } from '@/store/alarmStore';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onRecordingComplete: (recording: VoiceRecording | null) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const {
    recordingState,
    startRecording,
    stopRecording,
    resetRecording,
    createVoiceRecording,
  } = useVoiceRecording();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayback = () => {
    if (recordingState.audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current) {
          audioRef.current = new Audio(recordingState.audioUrl);
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

  const handleSaveRecording = async () => {
    const recording = await createVoiceRecording();
    onRecordingComplete(recording);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackProgress(0);
    resetRecording();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <CleanCard className="overflow-hidden">
        <CleanCardContent className="p-6">
          {/* Recording Status */}
          <div className="text-center mb-6">
            {recordingState.isRecording ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground">Recording</span>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {formatDuration(recordingState.duration)}
                </div>
                <Progress 
                  value={(recordingState.duration / 30) * 100} 
                  className="w-full h-1"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 30 seconds
                </p>
              </div>
            ) : recordingState.audioUrl ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Volume2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Ready to use</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {formatDuration(recordingState.duration)}
                </div>
                {isPlaying && (
                  <Progress 
                    value={playbackProgress} 
                    className="w-full h-1"
                  />
                )}
                <p className="text-sm text-muted-foreground">
                  {isPlaying ? 'Playing...' : 'Tap play to preview'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Mic className="w-8 h-8 mx-auto text-muted-foreground" />
                <div className="text-lg font-medium text-foreground">
                  Voice Message
                </div>
                <p className="text-sm text-muted-foreground">
                  Record a personalized alarm message
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!recordingState.isRecording && !recordingState.audioUrl && (
              <Button
                onClick={startRecording}
                size="lg"
                className="h-12 px-6 bg-primary hover:bg-primary/90"
              >
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            )}

            {recordingState.isRecording && (
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

            {recordingState.audioUrl && (
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
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="h-12 px-4"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  onClick={handleSaveRecording}
                  size="lg"
                  className="h-12 px-6 bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Use Recording
                </Button>
              </>
            )}
          </div>
        </CleanCardContent>
      </CleanCard>
    </div>
  );
};
