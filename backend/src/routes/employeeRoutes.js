const express = require('express');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  toggleStatus
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect); // Require JWT auth for all employee routes

router.route('/')
  .get(authorize('Admin', 'HR', 'Manager', 'Employee'), getAllEmployees)
  .post(authorize('Admin', 'HR'), createEmployee);

router.route('/:id')
  .get(getEmployeeById)
  .put(authorize('Admin', 'HR'), updateEmployee)
  .delete(authorize('Admin', 'HR'), deleteEmployee);

router.patch('/:id/toggle-status', authorize('Admin', 'HR'), toggleStatus);

module.exports = router;
