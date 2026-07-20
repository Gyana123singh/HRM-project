const express = require('express');
const {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllDepartments)
  .post(authorize('Admin', 'HR'), createDepartment);

router.route('/:id')
  .put(authorize('Admin', 'HR'), updateDepartment)
  .delete(authorize('Admin', 'HR'), deleteDepartment);

module.exports = router;
