import React from 'react';
import { EmptyState } from './EmptyState';

export const DataTable = ({
  columns,
  data,
  keyField = 'id',
  onRowClick,
  mobileCardRender
}) => {
  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table (Hidden on Mobile) */}
      <div className="hidden md:block glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2c2738]">
            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-5 py-4 font-bold tracking-wider">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row) => (
                <tr
                  key={row[keyField]}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-[#f8f7fc] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-5 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Stacked Cards (Visible only on Mobile) */}
      <div className="block md:hidden space-y-3">
        {data.map((row) => (
          <div
            key={row[keyField]}
            onClick={() => onRowClick && onRowClick(row)}
            className="glass-card rounded-2xl p-4 border border-slate-200 space-y-3"
          >
            {mobileCardRender ? (
              mobileCardRender(row)
            ) : (
              <div className="space-y-2">
                {columns.map((col, cIdx) => (
                  <div key={cIdx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">{col.header}:</span>
                    <span className="text-[#2c2738] font-semibold text-right">
                      {col.render ? col.render(row) : row[col.accessorKey]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
