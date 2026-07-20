import { create } from 'zustand';
import {
  employeesList,
  leaveRequests,
  regularizationRequests,
  recruitmentCandidates,
  jobsList,
  expenseClaims,
  helpDeskTickets,
  announcements,
  assetInventory
} from '../data/mockData';

export const useHRStore = create((set, get) => ({
  employees: employeesList,
  leaves: leaveRequests,
  regularizations: regularizationRequests,
  candidates: recruitmentCandidates,
  jobs: jobsList,
  expenses: expenseClaims,
  tickets: helpDeskTickets,
  announcementsList: announcements,
  assets: assetInventory,

  // Employee Management
  addEmployee: (newEmp) => {
    const created = {
      id: `EMP-${1000 + get().employees.length + 1}`,
      status: "Active",
      performanceRating: "5.0/5",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      ...newEmp
    };
    set((state) => ({ employees: [created, ...state.employees] }));
    return created;
  },

  updateEmployeeStatus: (id, newStatus) => {
    set((state) => ({
      employees: state.employees.map((emp) => emp.id === id ? { ...emp, status: newStatus } : emp)
    }));
  },

  deleteEmployee: (id) => {
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id)
    }));
  },

  // Leave Approvals
  approveLeave: (id) => {
    set((state) => ({
      leaves: state.leaves.map((item) => item.id === id ? { ...item, status: "Approved" } : item)
    }));
  },

  rejectLeave: (id) => {
    set((state) => ({
      leaves: state.leaves.map((item) => item.id === id ? { ...item, status: "Rejected" } : item)
    }));
  },

  // Regularization Approvals
  approveRegularization: (id) => {
    set((state) => ({
      regularizations: state.regularizations.map((item) => item.id === id ? { ...item, status: "Approved" } : item)
    }));
  },

  rejectRegularization: (id) => {
    set((state) => ({
      regularizations: state.regularizations.map((item) => item.id === id ? { ...item, status: "Rejected" } : item)
    }));
  },

  // ATS Candidate Management
  updateCandidateStage: (candidateId, newStage) => {
    set((state) => ({
      candidates: state.candidates.map((c) => c.id === candidateId ? { ...c, stage: newStage } : c)
    }));
  },

  addCandidate: (newCandidate) => {
    const created = {
      id: `CAN-0${get().candidates.length + 1}`,
      stage: "Applied",
      rating: 4.5,
      matchScore: Math.floor(Math.random() * 20) + 80,
      ...newCandidate
    };
    set((state) => ({ candidates: [created, ...state.candidates] }));
  },

  // Expenses Approvals
  approveExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.map((e) => e.id === id ? { ...e, status: "Approved" } : e)
    }));
  },

  rejectExpense: (id) => {
    set((state) => ({
      expenses: state.expenses.map((e) => e.id === id ? { ...e, status: "Rejected" } : e)
    }));
  },

  // Announcements
  addAnnouncement: (item) => {
    const newAnc = {
      id: `ANC-0${get().announcementsList.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      ...item
    };
    set((state) => ({ announcementsList: [newAnc, ...state.announcementsList] }));
  }
}));
