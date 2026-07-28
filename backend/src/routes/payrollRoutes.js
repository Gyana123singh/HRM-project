const express = require('express');
const {
  getPayrollDashboardStats,
  getSalaryStructures,
  createSalaryStructure,
  generateMonthlyPayroll,
  getAllPayslips,
  getMyPayslips,
  getPayslipById,
  updatePaymentStatus
} = require('../controllers/payrollController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect);

router.get('/stats', authorize('Admin', 'HR'), getPayrollDashboardStats);

router.route('/structures')
  .get(authorize('Admin', 'HR'), getSalaryStructures)
  .post(authorize('Admin', 'HR'), createSalaryStructure);

router.post('/generate', authorize('Admin', 'HR'), generateMonthlyPayroll);
router.get('/', authorize('Admin', 'HR'), getAllPayslips);
router.get('/my-slips', getMyPayslips);
router.get('/:id', getPayslipById);
router.patch('/:id/status', authorize('Admin', 'HR'), updatePaymentStatus);

module.exports = router;
