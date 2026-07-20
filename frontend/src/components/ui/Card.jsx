import React from 'react';

export const Card = ({ children, className = '', hoverable = false, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 border border-slate-200/80 shadow-sm ${hoverable ? 'glass-card-hover cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  change,
  changeType = 'positive', // positive, negative, neutral
  icon: Icon,
  iconBg = 'bg-[#f0edf7] text-[#534675]',
  description,
  onClick
}) => {
  return (
    <Card hoverable={Boolean(onClick)} onClick={onClick} className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#718096] mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#2c2738] tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110 shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-4 flex items-center text-xs gap-2">
          {change && (
            <span className={`px-2 py-0.5 rounded-md font-semibold ${changeType === 'positive' ? 'bg-[#9ec64c]/15 text-[#4a6414] border border-[#9ec64c]/30' :
                changeType === 'negative' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                  'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
              {change}
            </span>
          )}
          {description && <span className="text-slate-500 truncate">{description}</span>}
        </div>
      )}
    </Card>
  );
};
