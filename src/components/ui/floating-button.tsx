
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  className,
  disabled = false,
  isLoading = false
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-purple-500/25',
    secondary: 'bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white shadow-gray-500/25',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/25',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-red-500/25'
  };

  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'rounded-full border-4 border-white/20 backdrop-blur-sm',
        'shadow-2xl transform transition-all duration-300 ease-out',
        'hover:scale-110 hover:shadow-3xl active:scale-95',
        'focus:outline-none focus:ring-4 focus:ring-white/20',
        variants[variant],
        sizes[size],
        isLoading && 'animate-pulse',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
      ) : (
        children
      )}
    </Button>
  );
};
