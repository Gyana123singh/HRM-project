import axiosClient from './axiosClient';

export const ticketApi = {
  // Create a new support ticket
  createTicket: async (ticketData) => {
    return await axiosClient.post('/tickets', ticketData);
  },

  // Get logged in employee's support tickets
  getMyTickets: async () => {
    return await axiosClient.get('/tickets/my-tickets');
  },

  // Get all support tickets (Admin/HR view)
  getAllTickets: async () => {
    return await axiosClient.get('/tickets');
  },

  // Update support ticket status
  updateTicketStatus: async (id, statusData) => {
    return await axiosClient.patch(`/tickets/${id}/status`, statusData);
  }
};

export default ticketApi;
