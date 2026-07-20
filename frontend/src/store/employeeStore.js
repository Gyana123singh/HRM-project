import { create } from 'zustand';
import { currentUserEmployee } from '../data/mockData';

export const useEmployeeStore = create((set, get) => ({
  isCheckedIn: true,
  checkInTime: "09:02 AM",
  workingSeconds: 23100, // ~6 hours 25 minutes
  timerInterval: null,

  myLeaves: [
    { id: "LR-501", leaveType: "Casual Leave", startDate: "2026-07-28", endDate: "2026-07-29", totalDays: 2, reason: "Family event & personal travel", status: "Pending", appliedDate: "2026-07-19" },
    { id: "LR-488", leaveType: "Sick Leave", startDate: "2026-05-12", endDate: "2026-05-12", totalDays: 1, reason: "Dental procedure", status: "Approved", appliedDate: "2026-05-10" }
  ],

  myExpenses: [
    { id: "EXP-801", category: "Client Dinner & Transport", amount: "$145.50", date: "2026-07-15", receipt: "receipt_715.pdf", status: "Pending", description: "Meeting with enterprise client leads at Manhattan Bistro." }
  ],

  myTimesheets: [
    { id: "TS-1", date: "2026-07-20", project: "HRMS Enterprise Portal v2", task: "Design Mobile Drawer Navigation", hours: 6.5, description: "Built mobile navigation drawer and glassmorphism tabs." }
  ],

  myTickets: [
    { id: "TCK-901", subject: "Request for Second Monitor Adapter", category: "IT Support", priority: "Low", date: "2026-07-18", status: "Open", comments: ["Submitted request to IT desk."] }
  ],

  toggleCheckIn: () => {
    const currentState = get().isCheckedIn;
    if (currentState) {
      // Check Out
      set({ isCheckedIn: false });
    } else {
      // Check In
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      set({ isCheckedIn: true, checkInTime: timeStr });
    }
  },

  applyLeave: (leaveData) => {
    const newLeave = {
      id: `LR-${Math.floor(Math.random() * 900) + 100}`,
      status: "Pending",
      appliedDate: new Date().toISOString().split('T')[0],
      ...leaveData
    };
    set((state) => ({ myLeaves: [newLeave, ...state.myLeaves] }));
    return newLeave;
  },

  submitExpense: (expenseData) => {
    const newExp = {
      id: `EXP-${Math.floor(Math.random() * 900) + 100}`,
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      ...expenseData
    };
    set((state) => ({ myExpenses: [newExp, ...state.myExpenses] }));
    return newExp;
  },

  submitTimesheet: (timesheetData) => {
    const newTs = {
      id: `TS-${get().myTimesheets.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      ...timesheetData
    };
    set((state) => ({ myTimesheets: [newTs, ...state.myTimesheets] }));
    return newTs;
  },

  raiseTicket: (ticketData) => {
    const newTicket = {
      id: `TCK-${Math.floor(Math.random() * 900) + 100}`,
      date: new Date().toISOString().split('T')[0],
      status: "Open",
      comments: ["Ticket opened"],
      ...ticketData
    };
    set((state) => ({ myTickets: [newTicket, ...state.myTickets] }));
    return newTicket;
  }
}));
