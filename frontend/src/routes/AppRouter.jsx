import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleBasedRoute } from './ProtectedRoute';

// Layouts
import { HRLayout } from '../layouts/HRLayout';
import { EmployeeLayout } from '../layouts/EmployeeLayout';

// Auth Pages
import { Login } from '../features/auth/Login';
import { Unauthorized } from '../features/auth/Unauthorized';
import { NotFound } from '../features/auth/NotFound';

// Public Career Portal
import { CareerPortal } from '../features/public/CareerPortal';

// HR Admin Pages
import { HRDashboard } from '../features/hr/dashboard/HRDashboard';
import { OrgProfile } from '../features/hr/organization/OrgProfile';
import { OrgChart } from '../features/hr/organization/OrgChart';
import { EmployeeList } from '../features/hr/employees/EmployeeList';
import { AddEmployeeWizard } from '../features/hr/employees/AddEmployeeWizard';
import { EmployeeProfile } from '../features/hr/employees/EmployeeProfile';
import { AttendanceMatrix } from '../features/hr/attendance/AttendanceMatrix';
import { LeaveApprovals } from '../features/hr/attendance/LeaveApprovals';
import { PayrollDashboard } from '../features/hr/payroll/PayrollDashboard';
import { CandidatesKanban } from '../features/hr/recruitment/CandidatesKanban';
import { OnboardingTracker } from '../features/hr/lifecycle/OnboardingTracker';
import { GoalsOKRs } from '../features/hr/lifecycle/GoalsOKRs';
import { ExpenseApprovals } from '../features/hr/services/ExpenseApprovals';
import { AssetManagement } from '../features/hr/services/AssetManagement';
import { HRAIAssistant } from '../features/hr/ai/HRAIAssistant';
import { ResumeScreening } from '../features/hr/ai/ResumeScreening';

// Employee ESS Pages
import { EmployeeDashboard } from '../features/employee/dashboard/EmployeeDashboard';
import { ESSPayslips } from '../features/employee/finance/ESSPayslips';
import { ESSTasks } from '../features/employee/work/ESSTasks';
import { ESSGoals } from '../features/employee/growth/ESSGoals';
import { ESSHelpdesk } from '../features/employee/support/ESSHelpdesk';
import { ESSProfile } from '../features/employee/profile/ESSProfile';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/careers" element={<CareerPortal />} />
      <Route path="/403" element={<Unauthorized />} />

      {/* Protected Routes Container */}
      <Route element={<ProtectedRoute />}>
        {/* HR ADMIN PORTAL ROUTES */}
        <Route element={<RoleBasedRoute allowedRole="hr_admin" />}>
          <Route path="/hr" element={<HRLayout />}>
            <Route index element={<Navigate to="/hr/dashboard" replace />} />
            <Route path="dashboard" element={<HRDashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/add" element={<AddEmployeeWizard />} />
            <Route path="employees/:id" element={<EmployeeProfile />} />
            <Route path="attendance" element={<AttendanceMatrix />} />
            <Route path="attendance/regularization" element={<AttendanceMatrix />} />
            <Route path="attendance/shifts" element={<AttendanceMatrix />} />
            <Route path="attendance/leave" element={<LeaveApprovals />} />
            <Route path="attendance/calendar" element={<AttendanceMatrix />} />
            <Route path="payroll" element={<PayrollDashboard />} />
            <Route path="payroll/structures" element={<PayrollDashboard />} />
            <Route path="payroll/payslips" element={<PayrollDashboard />} />
            <Route path="lifecycle/onboarding" element={<GoalsOKRs />} />
            <Route path="lifecycle/performance" element={<GoalsOKRs />} />
            <Route path="lifecycle/goals" element={<GoalsOKRs />} />
            <Route path="lifecycle/recognition" element={<GoalsOKRs />} />
            <Route path="work/projects" element={<GoalsOKRs />} />
            <Route path="work/timesheets" element={<AttendanceMatrix />} />
            <Route path="reports" element={<HRDashboard />} />
            <Route path="ai/assistant" element={<HRAIAssistant />} />
            <Route path="ai/screening" element={<ResumeScreening />} />
            <Route path="admin/settings" element={<OrgProfile />} />
          </Route>
        </Route>

        {/* EMPLOYEE ESS PORTAL ROUTES */}
        <Route element={<RoleBasedRoute allowedRole="employee" />}>
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<Navigate to="/employee/dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="tasks" element={<ESSTasks />} />
            <Route path="payslips" element={<ESSPayslips />} />
            <Route path="goals" element={<ESSGoals />} />
            <Route path="helpdesk" element={<ESSHelpdesk />} />
            <Route path="profile" element={<ESSProfile />} />
          </Route>
        </Route>
      </Route>

      {/* Default Catch All */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
