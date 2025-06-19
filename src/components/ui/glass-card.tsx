
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'strong';
  animated?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  animated = true 
}) => {
  const variants = {
    default: 'bg-white/10 backdrop-blur-md border-white/20',
    subtle: 'bg-white/5 backdrop-blur-sm border-white/10',
    strong: 'bg-white/20 backdrop-blur-lg border-white/30'
  };

  return (
    <Card className={cn(
      variants[variant],
      'shadow-xl shadow-black/5 border',
      animated && 'transition-all duration-300 hover:bg-white/15 hover:shadow-2xl hover:-translate-y-1',
      className
    )}>
      {children}
    </Card>
  );
};

interface GlassCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardHeader: React.FC<GlassCardHeaderProps> = ({ children, className }) => (
  <CardHeader className={cn('pb-3', className)}>
    {children}
  </CardHeader>
);

interface GlassCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardContent: React.FC<GlassCardContentProps> = ({ children, className }) => (
  <CardContent className={cn('pt-0', className)}>
    {children}
  </CardContent>
);

interface GlassCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardTitle: React.FC<GlassCardTitleProps> = ({ children, className }) => (
  <CardTitle className={cn('text-white/90 font-semibold', className)}>
    {children}
  </CardTitle>
);
