const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, getMe, addTeacher, getStudentsByID } = require('../../controllers/studentController');
const { protect, protectBoth, protectTeacher } = require('../../middleware/authMiddleware')

router.post('/signup', registerStudent);

router.post('/signin', loginStudent);

router.get('/me', protect, getMe);

router.get('/', protectBoth, getStudentsByID)

router.put('/addTeacher/:id', protectTeacher, addTeacher);

module.exports = router;