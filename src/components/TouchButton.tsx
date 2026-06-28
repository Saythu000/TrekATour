import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/useTouchGestures';
import { cn } from '@/lib/utils';

interface TouchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  haptic?: 'light' | 'medium' | 'heavy' | 'none';
  children: React.ReactNode;
}

export const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    haptic = 'light',
    onClick,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const { lightTap, mediumTap, heavyTap } = useHapticFeedback();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      
      // Haptic feedback
      switch (haptic) {
        case 'light':
          lightTap();
          break;
        case 'medium':
          mediumTap();
          break;
        case 'heavy':
          heavyTap();
          break;
        case 'none':
        default:
          break;
      }

      onClick?.(e);
    };

    const baseClasses = cn(
      // Base styles
      'relative inline-flex items-center justify-center font-medium rounded-lg',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'active:scale-95 select-none',
      
      // Touch-friendly minimum size
      'min-h-[44px] min-w-[44px]',
      
      // Size variants
      size === 'sm' && 'px-3 py-2 text-sm',
      size === 'md' && 'px-4 py-3 text-base',
      size === 'lg' && 'px-6 py-4 text-lg',
      
      // Variant styles
      variant === 'primary' && !disabled && 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg hover:from-orange-700 hover:to-orange-800 hover:shadow-xl focus:ring-orange-500',
      variant === 'secondary' && !disabled && 'bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 hover:shadow-md focus:ring-gray-500',
      variant === 'ghost' && !disabled && 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      variant === 'outline' && !disabled && 'border-2 border-orange-600 text-orange-600 bg-transparent hover:bg-orange-50 focus:ring-orange-500',
      
      // Disabled state
      disabled && 'opacity-50 cursor-not-allowed',
      
      className
    );

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        onClick={handleClick}
        disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

TouchButton.displayName = 'TouchButton';
