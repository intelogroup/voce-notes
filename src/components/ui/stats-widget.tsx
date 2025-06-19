
import React from 'react';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface StatsWidgetProps {
  stats: Array<{
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color?: string;
  }>;
  className?: string;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ stats, className }) => {
  return (
    <GlassCard variant="subtle" className={cn('mb-6', className)}>
      <GlassCardContent className="p-4">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={cn(
                'inline-flex items-center justify-center w-10 h-10 rounded-full mb-2',
                stat.color || 'bg-purple-500/20 text-purple-300'
              )}>
                {stat.icon}
              </div>
              <div className="text-xl font-bold text-white/90">{stat.value}</div>
              <div className="text-xs text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </GlassCardContent>
    </GlassCard>
  );
};
