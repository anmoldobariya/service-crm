import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Maximize2, Minimize2 } from 'lucide-react';
import React, { useState } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footer?: React.ReactNode;
  resizable?: boolean;
  maximizable?: boolean;
  scrollable?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] max-h-[98vh]',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  headerClassName,
  contentClassName,
  footer,
  resizable = false,
  maximizable = false,
  scrollable = true,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && (closeOnOverlayClick || closeOnEscape)) {
      onClose();
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const currentSize = isMaximized ? 'full' : size;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          sizeClasses[currentSize],
          resizable && 'resize',
          scrollable ? 'overflow-y-auto' : 'overflow-hidden',
          'transition-all duration-200',
          className
        )}
        showCloseButton={showCloseButton}
        style={{
          ...(isMaximized && {
            width: '95vw',
            height: '95vh',
          }),
        }}
      >
        {/* Custom Header */}
        <DialogHeader className={cn('flex-shrink-0', headerClassName)}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {title && (
                <DialogTitle className="text-lg font-semibold truncate pr-2">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {maximizable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={toggleMaximize}
                >
                  {isMaximized ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className={cn(
          'flex-1 min-h-0',
          scrollable ? 'overflow-y-auto' : 'overflow-hidden',
          contentClassName
        )}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 pt-3">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Preset Modal Components

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  submitDisabled?: boolean;
  loading?: boolean;
  size?: ModalProps['size'];
  maximizable?: boolean;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Save',
  cancelText = 'Cancel',
  submitDisabled = false,
  loading = false,
  size = 'md',
  maximizable = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      scrollable={true}
      maximizable={maximizable}
      footer={
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            onClick={onSubmit}
            type='button'
            disabled={submitDisabled || loading}
          >
            {submitText}
          </Button>
        </div>
      }
    >
      {children}
    </Modal>
  );
};

export default Modal;
