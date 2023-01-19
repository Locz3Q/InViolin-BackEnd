const express = require('express');
const { deleteLesson, getLessons, addLesson } = require('../../controllers/lessonController');
const router = express.Router(); 
const { protectBoth, protectTeacher } = require('../../middleware/authMiddleware')

router.post('/', protectTeacher, addLesson);

router.get('/', protectBoth, getLessons);

router.delete('/:id', protectTeacher, deleteLesson);

module.exports = router;