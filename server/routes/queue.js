const express = require('express');
const router = express.Router();
const { protectBoth, protectTeacher, protect } = require('../../middleware/authMiddleware')
const { createqueue, getQueue, deleteQueue } = require('../../controllers/queueController')

router.post('/', protect, createqueue);

router.get('/:id', protectTeacher, getQueue);

router.delete('/:id', protectTeacher, deleteQueue);

module.exports = router;