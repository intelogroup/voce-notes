
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Play, RotateCcw, Check } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { VoiceRecording } from '@/store/alarmStore';

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

  const handlePlayback = () => {
    if (recordingState.audioUrl) {
      const audio = new Audio(recordingState.audioUrl);
      setIsPlaying(true);
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const handleSaveRecording = async () => {
    const recording = await createVoiceRecording();
    onRecordingComplete(recording);
  };

  const formatDuration = (seconds: number) => {
    return `${seconds.toFixed(1)}s`;
  };

  return (
    <div className="space-y-4">
      {/* Recording Display */}
      <Card className={`transition-colors ${recordingState.isRecording ? 'bg-red-50 border-red-200' : ''}`}>
        <CardContent className="p-6 text-center">
          {recordingState.isRecording ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {formatDuration(recordingState.duration)}
              </div>
              <div className="text-sm text-muted-foreground">
                Recording... (Max 30s)
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${(recordingState.duration / 30) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : recordingState.audioUrl ? (
            <div className="space-y-4">
              <div className="text-lg font-semibold text-green-600">
                Recording Complete!
              </div>
              <div className="text-sm text-muted-foreground">
                Duration: {formatDuration(recordingState.duration)}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Mic className="h-12 w-12 mx-auto text-muted-foreground" />
              <div className="text-lg font-medium">No recording yet</div>
              <div className="text-sm text-muted-foreground">
                Tap the microphone to start recording your alarm message
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        {!recordingState.isRecording && !recordingState.audioUrl && (
          <Button
            onClick={startRecording}
            size="lg"
            className="gap-2 h-14 px-8"
          >
            <Mic className="h-5 w-5" />
            Start Recording
          </Button>
        )}

        {recordingState.isRecording && (
          <Button
            onClick={stopRecording}
            variant="destructive"
            size="lg"
            className="gap-2 h-14 px-8"
          >
            <Square className="h-5 w-5" />
            Stop Recording
          </Button>
        )}

        {recordingState.audioUrl && (
          <>
            <Button
              onClick={handlePlayback}
              variant="outline"
              size="lg"
              disabled={isPlaying}
              className="gap-2"
            >
              <Play className="h-5 w-5" />
              {isPlaying ? 'Playing...' : 'Play'}
            </Button>

            <Button
              onClick={resetRecording}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Re-record
            </Button>

            <Button
              onClick={handleSaveRecording}
              size="lg"
              className="gap-2"
            >
              <Check className="h-5 w-5" />
              Use Recording
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
