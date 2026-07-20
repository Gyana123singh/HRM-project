import React from 'react';

export const Tabs = ({ tabs, activeTab, onChange, variant = 'line', className = '' }) => {
  return (
    <div className={`flex overflow-x-auto no-scrollbar border-b border-slate-200 ${className}`}>
      <div className="flex gap-2 min-w-max pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (variant === 'pills') {
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${isActive
                    ? 'bg-[#534675] text-white shadow-md shadow-[#534675]/20 border border-[#534675]/30'
                    : 'text-slate-600 hover:text-[#2c2738] hover:bg-[#f4f2f9]'
                  }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? 'bg-[#3d3358] text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all ${isActive
                  ? 'border-[#534675] text-[#534675] font-bold'
                  : 'border-transparent text-slate-500 hover:text-[#2c2738] hover:border-slate-300'
                }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
