import React from 'react';
import { useApp } from '../../context/AppContext';

interface WashiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'neutral';
  fullWidth?: boolean;
}

export const WashiButton: React.FC<WashiButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const { currentTheme } = useApp();

  let variantClass = '';
  
  if (variant === 'primary') {
    variantClass = `${currentTheme.classes.accentBg} text-white opacity-90 hover:opacity-100`;
  } else if (variant === 'secondary') {
    variantClass = `bg-gray-200 hover:bg-gray-300 text-gray-800`;
  } else {
    // Neutral
    variantClass = `${currentTheme.classes.cardBg} border-2 border-dashed ${currentTheme.classes.border} ${currentTheme.classes.subText} hover:${currentTheme.classes.text}`;
  }

  return (
    <button
      className={`
        relative px-6 py-2 rounded-sm font-hand text-lg transition-transform active:scale-95
        ${fullWidth ? 'w-full' : ''}
        ${variantClass}
        ${className}
        shadow-sm
      `}
      {...props}
    >
        <span className="relative z-10">{children}</span>
        {variant === 'primary' && (
             <div className="absolute inset-0 bg-white opacity-10 rotate-1 scale-105 pointer-events-none mix-blend-overlay"></div>
        )}
    </button>
  );
};