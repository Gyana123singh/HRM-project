import React, { useState } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { FilterBar } from '../../../components/common/FilterBar';
import { DataTable } from '../../../components/common/DataTable';
import { Avatar } from '../../../components/ui/Avatar';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useHRStore } from '../../../store/hrStore';
import { UserPlus, Mail, Phone, MapPin, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const EmployeeList = () => {
  const { employees, deleteEmployee } = useHRStore();
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({ department: '', status: '' });
  const [viewMode, setViewMode] = useState('list');
  const navigate = useNavigate();

  const filtered = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !activeFilters.department || emp.department === activeFilters.department;
    const matchesStatus = !activeFilters.status || emp.status === activeFilters.status;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteEmployee(id);
    toast.success(`Employee ${id} deleted`);
  };

  const columns = [
    {
      header: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.name} size="md" />
          <div>
            <h4 className="text-sm font-bold text-[#2c2738]">{row.name}</h4>
            <p className="text-xs text-slate-500 font-mono">{row.id}</p>
          </div>
        </div>
      )
    },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Designation', accessorKey: 'designation' },
    { header: 'Branch', accessorKey: 'branch' },
    { header: 'Joining Date', accessorKey: 'joinDate' },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(`/hr/employees/${row.id}`)} variant="ghost" size="sm" icon={Eye}>
            View Profile
          </Button>
          <button
            onClick={(e) => handleDelete(row.id, e)}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Employee Directory"
        subtitle={`Managing ${employees.length} active workforce members.`}
        breadcrumbs={['Employees', 'All Employees']}
        actions={
          <Button onClick={() => navigate('/hr/employees/add')} variant="primary" icon={UserPlus}>
            Add Employee
          </Button>
        }
      />

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        filters={[
          { key: 'department', label: 'Department', options: ['Engineering', 'Human Resources', 'Product & Design', 'Sales & Marketing', 'Customer Success'] },
          { key: 'status', label: 'Status', options: ['Active', 'Probation', 'On Leave', 'Notice Period'] }
        ]}
        activeFilters={activeFilters}
        onFilterChange={(key, val) => setActiveFilters({ ...activeFilters, [key]: val })}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'list' ? (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => navigate(`/hr/employees/${row.id}`)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => (
            <Card
              key={emp.id}
              hoverable
              onClick={() => navigate(`/hr/employees/${emp.id}`)}
              className="space-y-4 bg-white border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Avatar src={emp.avatar} name={emp.name} size="lg" />
                <StatusBadge status={emp.status} />
              </div>

              <div>
                <h4 className="text-base font-bold text-[#2c2738]">{emp.name}</h4>
                <p className="text-xs text-[#534675] font-bold">{emp.designation}</p>
                <p className="text-[11px] text-slate-500 mt-1">{emp.department} • {emp.branch}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{emp.phone}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
