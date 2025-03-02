
import React from 'react';
import { cn } from '@/lib/utils';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50 select-none';
  
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]',
    outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
    ghost: 'hover:bg-accent hover:text-accent-foreground active:scale-[0.98]'
  };
  
  const sizeStyles = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-6 py-2 text-lg'
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
