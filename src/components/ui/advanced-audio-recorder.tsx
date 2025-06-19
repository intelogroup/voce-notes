
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';
import { WaveformVisualizer } from '@/components/ui/waveform-visualizer';
import { Mic, Square, Play, Pause, RotateCcw, Volume2, Download, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedAudioRecorderProps {
  onRecordingComplete?: (blob: Blob, duration: number) => void;
  maxDuration?: number;
  className?: string;
}

export const AdvancedAudioRecorder: React.FC<AdvancedAudioRecorderProps> = ({
  onRecordingComplete,
  maxDuration = 300, // 5 minutes default
  className
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [volume, setVolume] = useState([100]);
  const [playbackSpeed, setPlaybackSpeed] = useState([1]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingQuality, setRecordingQuality] = useState({ bitrate: 128, fileSize: 0 });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for level monitoring
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      source.connect(analyserRef.current);
      
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
        setRecordingQuality({
          bitrate: 128,
          fileSize: Math.round(blob.size / 1024) // KB
        });
        onRecordingComplete?.(blob, duration);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      // Start timer and audio level monitoring
      intervalRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 0.1;
        });
        
        // Monitor audio levels
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setAudioLevel(0);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed[0];
      audioRef.current.volume = volume[0] / 100;
      audioRef.current.play();
      setIsPlaying(true);
      
      // Update playback time
      const updateTime = () => {
        if (audioRef.current) {
          setPlaybackTime(audioRef.current.currentTime);
          if (!audioRef.current.paused) {
            requestAnimationFrame(updateTime);
          }
        }
      };
      updateTime();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setDuration(0);
    setPlaybackTime(0);
    setIsPlaying(false);
    setIsPaused(false);
    setRecordingQuality({ bitrate: 128, fileSize: 0 });
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `voice-recording-${new Date().toISOString()}.wav`;
      a.click();
    }
  };

  return (
    <GlassCard variant="default" className={cn('w-full max-w-md mx-auto', className)}>
      <GlassCardContent className="p-6 space-y-6">
        {/* Recording Status */}
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-2">
            {isRecording ? 'Recording...' : audioUrl ? 'Recording Complete' : 'Ready to Record'}
          </div>
          <div className="text-white/60 text-sm">
            Duration: {duration.toFixed(1)}s
            {recordingQuality.fileSize > 0 && (
              <span className="ml-4">Size: {recordingQuality.fileSize}KB</span>
            )}
          </div>
        </div>

        {/* Waveform Visualizer */}
        <div className="bg-white/5 rounded-lg p-4 h-24 flex items-center justify-center">
          <WaveformVisualizer 
            isRecording={isRecording} 
            barCount={20}
            className="w-full"
          />
        </div>

        {/* Audio Level Meter (during recording) */}
        {isRecording && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>Audio Level</span>
              <span>{Math.round(audioLevel)}%</span>
            </div>
            <Progress 
              value={audioLevel} 
              className="h-2 bg-white/10"
            />
          </div>
        )}

        {/* Progress Bar (during playback) */}
        {audioUrl && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>{playbackTime.toFixed(1)}s</span>
              <span>{duration.toFixed(1)}s</span>
            </div>
            <Progress 
              value={(playbackTime / duration) * 100} 
              className="h-2 bg-white/10"
            />
          </div>
        )}

        {/* Recording Controls */}
        <div className="flex justify-center gap-3">
          {!isRecording && !audioUrl && (
            <Button
              onClick={startRecording}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-full w-16 h-16"
            >
              <Mic className="h-6 w-6" />
            </Button>
          )}
          
          {isRecording && (
            <Button
              onClick={stopRecording}
              size="lg"
              variant="destructive"
              className="rounded-full w-16 h-16"
            >
              <Square className="h-6 w-6" />
            </Button>
          )}
          
          {audioUrl && (
            <>
              <Button
                onClick={isPlaying ? pauseAudio : playAudio}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full w-16 h-16"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button
                onClick={resetRecording}
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-white/20 rounded-full w-16 h-16"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>

        {/* Advanced Controls (when audio is available) */}
        {audioUrl && (
          <div className="space-y-4 pt-4 border-t border-white/10">
            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Volume
                </span>
                <span>{volume[0]}%</span>
              </div>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Playback Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Speed</span>
                <span>{playbackSpeed[0]}x</span>
              </div>
              <Slider
                value={playbackSpeed}
                onValueChange={setPlaybackSpeed}
                min={0.5}
                max={2}
                step={0.25}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={downloadAudio}
                variant="outline"
                size="sm"
                className="flex-1 bg-white/10 border-white/20 hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              <Button
                onClick={resetRecording}
                variant="outline"
                size="sm"
                className="flex-1 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Hidden audio element for playback */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => {
              setIsPlaying(false);
              setPlaybackTime(0);
            }}
            style={{ display: 'none' }}
          />
        )}
      </GlassCardContent>
    </GlassCard>
  );
};
