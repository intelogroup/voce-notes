import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CleanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  borderClassName?: string;
}

export const CleanCard: React.FC<CleanCardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  borderClassName,
  ...props 
}) => {
  const variants = {
    default: 'bg-card border border-border',
    outline: 'border-2 border-border bg-transparent',
    ghost: 'border-0 bg-transparent shadow-none'
  };

  return (
    <Card 
      className={cn(
        variants[variant],
        'transition-colors',
        borderClassName,
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

interface CleanCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CleanCardHeader: React.FC<CleanCardHeaderProps> = ({ children, className }) => (
  <CardHeader className={cn('pb-3', className)}>
    {children}
  </CardHeader>
);

interface CleanCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CleanCardContent: React.FC<CleanCardContentProps> = ({ children, className }) => (
  <CardContent className={cn('pt-0', className)}>
    {children}
  </CardContent>
);

interface CleanCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CleanCardTitle: React.FC<CleanCardTitleProps> = ({ children, className }) => (
  <CardTitle className={cn('text-foreground font-semibold', className)}>
    {children}
  </CardTitle>
);
