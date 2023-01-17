const express = require('express');
const router = express.Router();
const queueModel = require('../models/queue');
const { createqueue, getQueue, deleteQueue } = require('../../controllers/queueController')

router.post('/', createqueue);

router.get('/:id', getQueue);

router.delete('/:id', deleteQueue);

module.exports = router;