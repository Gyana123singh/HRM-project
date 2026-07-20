import React from 'react';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Input } from '../ui/Input';

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search by name, ID, or title...",
  filters = [],
  activeFilters = {},
  onFilterChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 glass-card bg-white rounded-2xl border border-slate-200 mb-6">
      <div className="flex-1 min-w-[200px]">
        <Input
          icon={Search}
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-white"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {filters.map((filter) => (
          <div key={filter.key} className="shrink-0">
            <select
              value={activeFilters[filter.key] || ''}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
              className="bg-white border border-slate-200 text-[#2c2738] text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#534675]/30"
            >
              <option value="">{filter.label}: All</option>
              {filter.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}

        {viewMode && onViewModeChange && (
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 shrink-0">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#534675] text-white' : 'text-slate-500 hover:text-slate-800'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#534675] text-white' : 'text-slate-500 hover:text-slate-800'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
