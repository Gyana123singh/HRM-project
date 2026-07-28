const express = require('express');
const {
  createTask,
  getMyTasks,
  updateTaskStatus
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createTask);
router.get('/my-tasks', getMyTasks);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
