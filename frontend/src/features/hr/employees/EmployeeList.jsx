import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { FilterBar } from '../../../components/common/FilterBar';
import { DataTable } from '../../../components/common/DataTable';
import { Avatar } from '../../../components/ui/Avatar';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useHRStore } from '../../../store/hrStore';
import { employeeApi, authApi } from '../../../api';
import { UserPlus, Mail, Phone, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const EmployeeList = () => {
  const { employees: mockEmployees, deleteEmployee: deleteStoreEmp } = useHRStore();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({ department: '', status: '' });
  const [viewMode, setViewMode] = useState('list');
  const navigate = useNavigate();

  const getActiveEmployees = (list) => {
    try {
      const deleted = JSON.parse(localStorage.getItem('deleted_employee_ids') || '[]');
      if (!Array.isArray(deleted) || deleted.length === 0) return list;
      return list.filter((emp) => {
        const isMongoDeleted = emp.mongoId && deleted.includes(String(emp.mongoId));
        const isIdDeleted = emp.id && deleted.includes(String(emp.id));
        return !isMongoDeleted && !isIdDeleted;
      });
    } catch (e) {
      return list;
    }
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      let combined = [];

      const res = await employeeApi.getAllEmployees({
        search,
        status: activeFilters.status
      });

      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const normalized = res.data.map((emp) => ({
          mongoId: emp._id,
          id: emp.employeeCode || emp._id,
          name: `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Unnamed Employee',
          department: emp.department?.name || emp.department || 'General',
          designation: emp.designation || 'Staff Member',
          branch: emp.address?.city || 'Headquarters',
          joinDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : '2026-01-01',
          status: emp.status || 'Active',
          email: emp.email,
          phone: emp.phone || 'N/A',
          avatar: emp.avatar || ''
        }));
        combined = [...normalized];
      }

      // Merge store employees so newly added employees always display
      mockEmployees.forEach((mEmp) => {
        const exists = combined.some(
          (bEmp) => bEmp.email === mEmp.email || bEmp.id === mEmp.id || bEmp.mongoId === mEmp.id
        );
        if (!exists) {
          combined.push({
            mongoId: mEmp.id || `MOCK-${mEmp.email}`,
            id: mEmp.id || `EMP-${Math.floor(100 + Math.random() * 900)}`,
            name: mEmp.name || `${mEmp.firstName || ''} ${mEmp.lastName || ''}`.trim() || 'New Employee',
            department: mEmp.department || 'Human Resources',
            designation: mEmp.designation || 'Staff Member',
            branch: mEmp.branch || 'Global Headquarters',
            joinDate: mEmp.joinDate || new Date().toISOString().split('T')[0],
            status: mEmp.status || 'Active',
            email: mEmp.email,
            phone: mEmp.phone || 'N/A',
            avatar: mEmp.avatar || ''
          });
        }
      });

      setEmployees(getActiveEmployees(combined));
    } catch (err) {
      console.log('Employee API fetch fallback:', err.message);
      setEmployees(getActiveEmployees(mockEmployees));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, activeFilters.status]);

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !activeFilters.department || emp.department === activeFilters.department;
    const matchesStatus = !activeFilters.status || emp.status === activeFilters.status;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleDelete = async (emp, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently delete employee "${emp.name}"?`)) return;

    try {
      const delId = emp.mongoId || emp.id;
      if (delId) {
        await employeeApi.deleteEmployee(delId);
      }
    } catch (err) {
      console.log('Backend delete employee notification:', err.message);
    }

    try {
      const deleted = JSON.parse(localStorage.getItem('deleted_employee_ids') || '[]');
      if (emp.mongoId && !deleted.includes(String(emp.mongoId))) deleted.push(String(emp.mongoId));
      if (emp.id && !deleted.includes(String(emp.id))) deleted.push(String(emp.id));
      localStorage.setItem('deleted_employee_ids', JSON.stringify(deleted));
    } catch (e) {
      console.log('Error saving deleted employee to localStorage:', e);
    }

    deleteStoreEmp(emp.id);
    setEmployees((prev) => prev.filter((item) => item.id !== emp.id && item.mongoId !== emp.mongoId));
    toast.success(`Employee ${emp.name} deleted permanently`);
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
          <Button onClick={() => navigate(`/hr/employees/${row.mongoId || row.id}`)} variant="ghost" size="sm" icon={Eye}>
            View Profile
          </Button>
          <button
            onClick={(e) => handleDelete(row, e)}
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
          { key: 'department', label: 'Department', options: ['Engineering', 'Human Resources', 'Finance', 'Product & Design', 'Sales & Marketing'] },
          { key: 'status', label: 'Status', options: ['Active', 'Inactive', 'Offboarded'] }
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
          onRowClick={(row) => navigate(`/hr/employees/${row.mongoId || row.id}`)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => (
            <Card
              key={emp.id}
              hoverable
              onClick={() => navigate(`/hr/employees/${emp.mongoId || emp.id}`)}
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
