import React from 'react';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  X,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AlertProps {
  title?: string;
  description?: string;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'outline';
  }[];
  children?: React.ReactNode;
}

const variantStyles = {
  default: 'border-border bg-background text-foreground',
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-900/10 dark:text-blue-100',
  success: 'border-green-200 bg-green-50 text-green-900 dark:border-green-900/50 dark:bg-green-900/10 dark:text-green-100',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-900/50 dark:bg-yellow-900/10 dark:text-yellow-100',
  error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-100',
};

const variantIcons = {
  default: AlertCircle,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const sizeStyles = {
  sm: 'p-3 text-sm',
  md: 'p-4',
  lg: 'p-6 text-lg',
};

export const Alert: React.FC<AlertProps> = ({
  title,
  description,
  variant = 'default',
  size = 'md',
  dismissible = false,
  onDismiss,
  className,
  icon,
  showIcon = true,
  actions,
  children,
}) => {
  const IconComponent = variantIcons[variant];
  const displayIcon = icon || (showIcon && <IconComponent className="h-5 w-5" />);

  return (
    <div
      className={cn(
        'relative rounded-lg border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        {displayIcon && (
          <div className="flex-shrink-0 mt-0.5">
            {displayIcon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-medium mb-1">
              {title}
            </h4>
          )}

          {description && (
            <p className="text-sm opacity-90 mb-2">
              {description}
            </p>
          )}

          {children && (
            <div className="text-sm">
              {children}
            </div>
          )}

          {actions && actions.length > 0 && (
            <div className="flex space-x-2 mt-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                  className="h-8"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        )}
      </div>
    </div>
  );
};

// Preset Alert Components
export const InfoAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert {...props} variant="info" />
);

export const SuccessAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert {...props} variant="success" />
);

export const WarningAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert {...props} variant="warning" />
);

export const ErrorAlert: React.FC<Omit<AlertProps, 'variant'>> = (props) => (
  <Alert {...props} variant="error" />
);

export default Alert;
