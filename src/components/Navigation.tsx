import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

export interface NavigationItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface NavigationProps {
  items: NavigationItem[];
  variant?: 'horizontal' | 'vertical' | 'tabs' | 'pills';
  className?: string;
  onItemClick?: (item: NavigationItem, index: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  items,
  variant = 'horizontal',
  className,
  onItemClick,
}) => {
  const baseClasses = {
    horizontal: 'flex flex-row space-x-1',
    vertical: 'flex flex-col space-y-1',
    tabs: 'flex flex-row border-b',
    pills: 'flex flex-row space-x-2 p-2 bg-muted/50 rounded-lg'
  };

  const itemClasses = {
    horizontal: 'px-3 py-2',
    vertical: 'w-full justify-start px-3 py-2',
    tabs: 'px-4 py-2 border-b-2 border-transparent data-[active=true]:border-primary',
    pills: 'px-3 py-5 rounded-md'
  };

  const getVariant = (item: NavigationItem) => {
    switch (variant) {
      case 'tabs':
        return item.active ? 'ghost' : 'ghost';
      case 'pills':
        return item.active ? 'default' : 'ghost';
      default:
        return item.active ? 'default' : 'ghost';
    }
  };

  const handleItemClick = (item: NavigationItem, index: number) => {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    }

    if (onItemClick) {
      onItemClick(item, index);
    }

    if (item.href && !item.onClick) {
      window.location.href = item.href;
    }
  };

  return (
    <nav className={cn(baseClasses[variant], className)}>
      {items.map((item, index) => (
        <Button
          key={index}
          variant={getVariant(item)}
          size="sm"
          disabled={item.disabled}
          className={cn(
            itemClasses[variant],
            variant === 'pills' && item.active && 'bg-[#1e3a8a]',
            variant === 'pills' && !item.active && 'hover:bg-gray-200',
            variant === 'tabs' && item.active && 'border-b-primary',
            variant === 'tabs' && 'rounded-none border-b-2 border-transparent hover:border-muted-foreground/50'
          )}
          onClick={() => handleItemClick(item, index)}
          data-active={item.active}
        >
          {item.icon && (
            <span className="mr-2 h-4 w-4">{item.icon}</span>
          )}
          {item.label}
          {item.badge && (
            <span className={cn(
              "ml-2 rounded-full bg-[#1e3a8a]/10 px-2 py-0.5 text-xs",
              item.active && 'bg-white text-black'
            )}>
              {item.badge}
            </span>
          )}
        </Button>
      ))}
    </nav>
  );
};

export default Navigation;
