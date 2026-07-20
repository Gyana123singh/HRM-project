import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { DataTable } from '../../../components/common/DataTable';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { attendanceLogsToday, regularizationRequests as initialRegularizations, holidays as initialHolidays } from '../../../data/mockData';
import { Clock, Check, X, Calendar, Plus, Users, AlertCircle, Sun, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const initialShifts = [
  { id: 'SFT-01', name: 'General Shift', timing: '09:00 AM - 06:00 PM', breakDuration: '1 Hour', membersCount: 245, status: 'Active' },
  { id: 'SFT-02', name: 'APAC Early Morning Shift', timing: '06:00 AM - 03:00 PM', breakDuration: '45 Mins', membersCount: 68, status: 'Active' },
  { id: 'SFT-03', name: 'US Night Shift', timing: '06:00 PM - 03:00 AM', breakDuration: '1 Hour', membersCount: 52, status: 'Active' },
  { id: 'SFT-04', name: '24/7 Support Rotational Shift', timing: 'Rotational (8h)', breakDuration: '1 Hour', membersCount: 30, status: 'Active' }
];

export const AttendanceMatrix = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [logs, setLogs] = useState(attendanceLogsToday);
  const [regList, setRegList] = useState(initialRegularizations);
  const [shiftsList, setShiftsList] = useState(initialShifts);
  const [holidaysList, setHolidaysList] = useState(initialHolidays);

  // Modals state
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);

  // New Item States
  const [newShift, setNewShift] = useState({ name: '', timing: '09:00 AM - 06:00 PM', breakDuration: '1 Hour' });
  const [newHoliday, setNewHoliday] = useState({ title: '', date: '', type: 'Public Holiday' });

  // Map route to active tab
  const getActiveTab = () => {
    if (location.pathname.includes('/regularization')) return 'regularization';
    if (location.pathname.includes('/shifts')) return 'shifts';
    if (location.pathname.includes('/calendar')) return 'calendar';
    return 'attendance';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabId) => {
    if (tabId === 'regularization') navigate('/hr/attendance/regularization');
    else if (tabId === 'shifts') navigate('/hr/attendance/shifts');
    else if (tabId === 'calendar') navigate('/hr/attendance/calendar');
    else navigate('/hr/attendance');
  };

  const attendanceTabs = [
    { id: 'attendance', label: 'Daily Attendance' },
    { id: 'regularization', label: `Regularization (${regList.filter(r => r.status === 'Pending').length} Pending)` },
    { id: 'shifts', label: `Shift Roster (${shiftsList.length})` },
    { id: 'calendar', label: `Holidays (${holidaysList.length})` }
  ];

  const handleApproveReg = (id, name) => {
    setRegList(regList.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    toast.success(`Approved attendance regularization for ${name}`);
  };

  const handleRejectReg = (id, name) => {
    setRegList(regList.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    toast.error(`Rejected attendance regularization for ${name}`);
  };

  const handleCreateShift = (e) => {
    e.preventDefault();
    const created = {
      id: `SFT-0${shiftsList.length + 1}`,
      name: newShift.name,
      timing: newShift.timing,
      breakDuration: newShift.breakDuration,
      membersCount: 0,
      status: 'Active'
    };
    setShiftsList([...shiftsList, created]);
    toast.success(`Shift ${newShift.name} created successfully!`);
    setIsAddShiftOpen(false);
    setNewShift({ name: '', timing: '09:00 AM - 06:00 PM', breakDuration: '1 Hour' });
  };

  const handleCreateHoliday = (e) => {
    e.preventDefault();
    const created = {
      id: `HOL-0${holidaysList.length + 1}`,
      title: newHoliday.title,
      date: newHoliday.date,
      type: newHoliday.type,
      day: new Date(newHoliday.date).toLocaleDateString('en-US', { weekday: 'long' })
    };
    setHolidaysList([...holidaysList, created]);
    toast.success(`Holiday ${newHoliday.title} added to calendar!`);
    setIsAddHolidayOpen(false);
    setNewHoliday({ title: '', date: '', type: 'Public Holiday' });
  };

  const attendanceColumns = [
    { header: 'Employee ID', accessorKey: 'employeeId' },
    { header: 'Employee Name', accessorKey: 'name' },
    { header: 'Check In', accessorKey: 'checkIn' },
    { header: 'Check Out', accessorKey: 'checkOut' },
    { header: 'Working Hours', accessorKey: 'hours' },
    { header: 'Late By', accessorKey: 'lateBy' },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button onClick={() => toast.success(`Updated attendance for ${row.name}`)} variant="outline" size="sm">
          Manual Edit
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      {/* Page Header */}
      <PageHeader
        title="Time & Attendance Management"
        subtitle="Manage daily attendance feeds, regularization requests, shift rosters, and holidays."
        breadcrumbs={['Time & Attendance', activeTab.charAt(0).toUpperCase() + activeTab.slice(1)]}
        actions={
          activeTab === 'shifts' ? (
            <Button onClick={() => setIsAddShiftOpen(true)} variant="primary" icon={Plus}>
              Create Shift
            </Button>
          ) : activeTab === 'calendar' ? (
            <Button onClick={() => setIsAddHolidayOpen(true)} variant="primary" icon={Plus}>
              Add Holiday
            </Button>
          ) : null
        }
      />

      {/* Navigation Tabs */}
      <Tabs tabs={attendanceTabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* TAB 1: DAILY ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <DataTable columns={attendanceColumns} data={logs} />
        </div>
      )}

      {/* TAB 2: REGULARIZATION REQUESTS */}
      {activeTab === 'regularization' && (
        <div className="space-y-4">
          {regList.map((req) => (
            <Card key={req.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200 shadow-xs">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-[#2c2738]">{req.name}</h4>
                  <span className="text-xs font-mono text-slate-500">{req.employeeId}</span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs text-[#534675] font-bold">
                  Requested Date: {req.date} • Requested Punch-in: <strong className="text-[#59781b]">{req.requestedCheckIn}</strong> (Original: {req.originalCheckIn})
                </p>
                <p className="text-xs text-[#2c2738] bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-2">
                  <span className="text-slate-500 font-semibold">Reason:</span> "{req.reason}"
                </p>
              </div>

              {req.status === 'Pending' && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button onClick={() => handleApproveReg(req.id, req.name)} variant="accent" icon={Check}>
                    Approve
                  </Button>
                  <Button onClick={() => handleRejectReg(req.id, req.name)} variant="danger" icon={X}>
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: SHIFT ROSTER */}
      {activeTab === 'shifts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shiftsList.map((sft) => (
            <Card key={sft.id} className="space-y-4 bg-white border border-slate-200 shadow-xs hover:border-[#534675]/40 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#f0edf7] text-[#534675] rounded-xl border border-[#dcd6e8]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#2c2738]">{sft.name}</h4>
                    <p className="text-xs text-[#534675] font-bold">{sft.timing}</p>
                  </div>
                </div>
                <StatusBadge status={sft.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Meal Break</p>
                  <p className="font-bold text-[#2c2738]">{sft.breakDuration}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Assigned Staff</p>
                  <p className="font-bold text-[#534675]">{sft.membersCount} Members</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 4: HR HOLIDAY CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {holidaysList.map((hol) => (
            <Card key={hol.id} className="space-y-3 bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3.5 bg-[#f2f8e8] text-[#59781b] rounded-2xl border border-[#9ec64c]/40 flex flex-col items-center justify-center shrink-0 w-16">
                  <Sun className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] font-extrabold uppercase">{hol.day.slice(0, 3)}</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#2c2738]">{hol.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{hol.date}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#f0edf7] text-[#534675] text-[10px] font-bold rounded-md border border-[#dcd6e8]">
                    {hol.type}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL: CREATE SHIFT */}
      <Modal
        isOpen={isAddShiftOpen}
        onClose={() => setIsAddShiftOpen(false)}
        title="Create New Shift Timing"
        subtitle="Define work hours and break schedules for organizational rosters."
        footer={
          <>
            <Button onClick={() => setIsAddShiftOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateShift} variant="primary">Create Shift</Button>
          </>
        }
      >
        <form onSubmit={handleCreateShift} className="space-y-4">
          <Input
            label="Shift Name"
            value={newShift.name}
            onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
            placeholder="e.g. EMEA Afternoon Shift"
            required
          />
          <Input
            label="Shift Hours / Timing"
            value={newShift.timing}
            onChange={(e) => setNewShift({ ...newShift, timing: e.target.value })}
            placeholder="e.g. 02:00 PM - 11:00 PM"
            required
          />
          <Input
            label="Break Duration"
            value={newShift.breakDuration}
            onChange={(e) => setNewShift({ ...newShift, breakDuration: e.target.value })}
            placeholder="e.g. 1 Hour"
            required
          />
        </form>
      </Modal>

      {/* MODAL: ADD HOLIDAY */}
      <Modal
        isOpen={isAddHolidayOpen}
        onClose={() => setIsAddHolidayOpen(false)}
        title="Add Holiday to Calendar"
        subtitle="Broadcast national, public, or company holiday dates to employees."
        footer={
          <>
            <Button onClick={() => setIsAddHolidayOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateHoliday} variant="primary">Add Holiday</Button>
          </>
        }
      >
        <form onSubmit={handleCreateHoliday} className="space-y-4">
          <Input
            label="Holiday Title"
            value={newHoliday.title}
            onChange={(e) => setNewHoliday({ ...newHoliday, title: e.target.value })}
            placeholder="e.g. New Year's Day"
            required
          />
          <Input
            label="Holiday Date"
            type="date"
            value={newHoliday.date}
            onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
            required
          />
          <Select
            label="Holiday Category"
            value={newHoliday.type}
            onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value })}
            options={[
              { label: 'Public Holiday', value: 'Public Holiday' },
              { label: 'National Holiday', value: 'National Holiday' },
              { label: 'Company Holiday', value: 'Company Holiday' },
              { label: 'Restricted Holiday', value: 'Restricted Holiday' }
            ]}
          />
        </form>
      </Modal>
    </div>
  );
};
