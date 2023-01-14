const express = require('express');
const router = express.Router();
const queueModel = require('../models/queue');
const { createqueue, getqueue } = require('../../controllers/queueController')

router.post('/', createqueue)
router.get('/:id', getqueue);

module.exports = router;