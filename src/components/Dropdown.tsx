import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
  group?: string;
}

export interface DropdownProps {
  items: DropdownItem[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  maxHeight?: string;
  showGroups?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  searchPlaceholder?: string;
  maxSelectedDisplay?: number;
  emptyMessage?: string;
  noResultsMessage?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  value,
  onChange,
  placeholder = 'Select an option...',
  multiple = false,
  searchable = false,
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  size = 'md',
  variant = 'outline',
  maxHeight = '300px',
  showGroups = false,
  clearable = false,
  onClear,
  searchPlaceholder = 'Search options...',
  maxSelectedDisplay = 2,
  emptyMessage = 'No options available',
  noResultsMessage = 'No results found',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-3',
    lg: 'h-12 px-4 text-lg',
  };

  const selectedItems = Array.isArray(value) ? value : value ? [value] : [];
  const selectedLabels = items.filter(item => selectedItems.includes(item.value)).map(item => item.label);

  const filteredItems = searchable
    ? items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : items;

  // Group items properly with consistent styling
  const groupedItems = showGroups
    ? filteredItems.reduce((acc, item) => {
      const group = item.group || 'Default';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {} as Record<string, DropdownItem[]>)
    : { 'All Items': filteredItems };

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;

    if (multiple) {
      const newValue = selectedItems.includes(item.value)
        ? selectedItems.filter(v => v !== item.value)
        : [...selectedItems, item.value];
      onChange(newValue);
    } else {
      onChange(item.value);
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (selectedLabels.length === 0) return placeholder;
    if (selectedLabels.length === 1) return selectedLabels[0];
    if (selectedLabels.length <= maxSelectedDisplay) {
      return selectedLabels.join(', ');
    }
    return `${selectedLabels.length} items selected`;
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiple ? [] : '');
    if (onClear) onClear();
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <Button
        variant={variant}
        className={cn(
          'justify-between font-normal w-full',
          sizeClasses[size],
          triggerClassName
        )}
        onClick={(e) => {
          // Check if the clear icon area was clicked
          const target = e.target as HTMLElement;
          if (clearable && selectedItems.length > 0 && target.closest('.clear-trigger')) {
            e.stopPropagation();
            handleClearSelection(e);
            return;
          }
          setIsOpen(!isOpen);
        }}
        disabled={disabled}
      >
        <span className="truncate">{getDisplayText()}</span>
        <div className="flex items-center gap-1">
          {clearable && selectedItems.length > 0 && (
            <span
              className="clear-trigger flex items-center justify-center w-5 h-5 rounded hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )} />
        </div>
      </Button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content - improved scrolling */}
          <div
            className={cn(
              'absolute top-full left-0 right-0 z-50 mt-1',
              'bg-popover border border-border rounded-md shadow-md',
              contentClassName
            )}
            style={{ maxHeight }}
          >
            {/* Search Input - fixed outside scroll area */}
            {searchable && (
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      'w-full pl-10 pr-8 py-2 text-sm',
                      'bg-background border border-input rounded-md',
                      'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
                    )}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                      title="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scrollable Items Container */}
            <div className="overflow-y-auto" style={{ maxHeight: searchable ? 'calc(300px - 60px)' : '300px' }}>
              <div className="py-1">
                {/* Clear All option for multiselect when items are selected */}
                {multiple && selectedItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground border-b border-border"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Clear all ({selectedItems.length})</span>
                  </button>
                )}

                {Object.entries(groupedItems).map(([groupName, groupItems]) => (
                  <React.Fragment key={groupName}>
                    {/* Group Header - consistent styling */}
                    {showGroups && filteredItems.length > 0 && groupName !== 'All Items' && (
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">
                        {groupName}
                      </div>
                    )}

                    {/* Group Items - all with same consistent styling */}
                    {groupItems.map((item) => {
                      const isSelected = selectedItems.includes(item.value);
                      return (
                        <button
                          key={item.value}
                          className={cn(
                            'w-full px-3 py-2 text-left flex items-center gap-2',
                            'text-sm text-foreground',
                            'hover:bg-accent hover:text-accent-foreground',
                            'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            isSelected && 'bg-gray-300 text-accent-foreground'
                          )}
                          onClick={() => handleSelect(item)}
                          disabled={item.disabled}
                        >
                          {/* Icon */}
                          {item.icon && (
                            <span className="flex-shrink-0 w-4 h-4">
                              {item.icon}
                            </span>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium">
                              {item.label}
                            </div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground truncate">
                                {item.description}
                              </div>
                            )}
                          </div>

                          {/* Selection indicator */}
                          {multiple ? (
                            <div className="flex-shrink-0 h-4 w-4 rounded-sm border border-primary flex items-center justify-center"
                              style={{
                                backgroundColor: isSelected ? 'hsl(var(--primary))' : 'transparent',
                                color: isSelected ? 'hsl(var(--primary-foreground))' : 'transparent'
                              }}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                          ) : (
                            isSelected && (
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            )
                          )}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}

                {/* Empty state */}
                {filteredItems.length === 0 && (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    {searchQuery ? noResultsMessage : emptyMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;