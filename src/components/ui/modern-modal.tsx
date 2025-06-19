
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-900/95 border-gray-700',
  success: 'bg-green-900/90 border-green-700',
  warning: 'bg-yellow-900/90 border-yellow-700',
  error: 'bg-red-900/90 border-red-700',
  info: 'bg-blue-900/90 border-blue-700',
};

const sizeStyles = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
};

const variantIcons = {
  default: null,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

export const ModernModal: React.FC<ModernModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  variant = 'default',
  size = 'md',
  showCloseButton = true,
  actions,
  className
}) => {
  const Icon = variantIcons[variant];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          'backdrop-blur-xl border text-white overflow-hidden',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
      >
        {/* Close Button */}
        {showCloseButton && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Header */}
        {(title || Icon) && (
          <DialogHeader className="space-y-3">
            {Icon && (
              <div className="flex justify-center">
                <div className={cn(
                  'p-3 rounded-full',
                  variant === 'success' && 'bg-green-500/20 text-green-400',
                  variant === 'warning' && 'bg-yellow-500/20 text-yellow-400',
                  variant === 'error' && 'bg-red-500/20 text-red-400',
                  variant === 'info' && 'bg-blue-500/20 text-blue-400'
                )}>
                  <Icon className="h-8 w-8" />
                </div>
              </div>
            )}
            
            {title && (
              <DialogTitle className="text-xl font-bold text-white text-center">
                {title}
              </DialogTitle>
            )}
            
            {description && (
              <DialogDescription className="text-white/70 text-center">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {/* Content */}
        {children && (
          <div className="py-4">
            {children}
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="flex gap-3 pt-4 border-t border-white/10">
            {actions}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Preset confirmation modal
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'warning' | 'error';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false
}) => {
  return (
    <ModernModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      variant={variant}
      actions={
        <>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-white/10 border-white/20 hover:bg-white/20"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            variant={variant === 'error' ? 'destructive' : 'default'}
            className={cn(
              'flex-1',
              variant === 'warning' && 'bg-yellow-600 hover:bg-yellow-700'
            )}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : confirmText}
          </Button>
        </>
      }
    />
  );
};
