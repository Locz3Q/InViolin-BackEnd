const express = require('express');
const router = express.Router();
const { registerTeacher, loginTeacher, getMe, getAll, getByUsername, pushStudent, getbyID } = require('../../controllers/teacherController');
const { protectTeacher, protectBoth } = require('../../middleware/authMiddleware')


router.post('/signup', registerTeacher);

router.post('/signin', loginTeacher);

router.get('/me', protectTeacher, getMe);

router.get('/', protectBoth, getAll);

router.post('/getTeacher', protectBoth, getByUsername);

router.put('/addStudent/:id', protectBoth, pushStudent);

router.get('/:id', protectBoth, getbyID)

module.exports = router;