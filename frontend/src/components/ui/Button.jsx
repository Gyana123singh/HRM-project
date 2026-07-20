import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white cursor-pointer rounded-xl active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none';

  const variants = {
    primary: 'bg-[#e95f87] hover:bg-[#d84c75] text-white shadow-md shadow-[#e95f87]/20 border border-[#e95f87]/30 focus:ring-[#e95f87]',
    secondary: 'bg-[#534675] hover:bg-[#433761] text-white shadow-md shadow-[#534675]/20 focus:ring-[#534675]',
    accent: 'bg-[#9ec64c] hover:bg-[#8eb63d] text-white shadow-md shadow-[#9ec64c]/20 focus:ring-[#9ec64c]',
    outline: 'bg-white border border-[#dcd6e8] hover:bg-[#f4f2f9] text-[#534675] focus:ring-[#534675]',
    ghost: 'bg-transparent hover:bg-[#f4f2f9] text-[#5c5670] hover:text-[#2c2738] focus:ring-[#534675]',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 focus:ring-rose-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5 min-h-[44px]' // 44px touch-target standard
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
