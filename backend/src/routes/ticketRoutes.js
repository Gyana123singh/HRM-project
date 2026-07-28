const express = require('express');
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus
} = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect);

router.post('/', createTicket);
router.get('/my-tickets', getMyTickets);
router.get('/', authorize('Admin', 'HR'), getAllTickets);
router.patch('/:id/status', authorize('Admin', 'HR'), updateTicketStatus);

module.exports = router;
