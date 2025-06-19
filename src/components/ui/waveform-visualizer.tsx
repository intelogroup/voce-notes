
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface WaveformVisualizerProps {
  isRecording: boolean;
  className?: string;
  barCount?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isRecording,
  className,
  barCount = 12
}) => {
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(0));

  useEffect(() => {
    if (!isRecording) {
      setBars(Array(barCount).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => 
        prev.map(() => Math.random() * 100)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording, barCount]);

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {bars.map((height, index) => (
        <div
          key={index}
          className={cn(
            'w-1 bg-white/60 rounded-full transition-all duration-100',
            isRecording ? 'animate-pulse' : ''
          )}
          style={{
            height: isRecording ? `${Math.max(height * 0.4, 10)}px` : '4px'
          }}
        />
      ))}
    </div>
  );
};
