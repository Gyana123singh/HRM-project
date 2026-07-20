import React from 'react';

export const Avatar = ({ src, name = 'User', size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : n[0];
  };

  return (
    <div className={`relative inline-block rounded-full overflow-hidden shrink-0 bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-semibold uppercase">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`bg-slate-800/80 animate-pulse rounded-xl ${className}`} />
  );
};
