const express = require('express');
const { getAIInsights, chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/insights', getAIInsights);
router.post('/chat', chatWithAI);

module.exports = router;
