const express = require('express');
const router = express.Router();
const TeacherModel = require('../models/teacher');
const { loginTeacher, signupTeacher, getAllTechers, updateTeacherData, deleteTeacher } = require('../../controllers/teacherController');

router.get(`/offGet`, async (req, res) => {
  try {
    res.json({"users": ["Blazej", "Biskup"]})
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

//signup
router.post(`/signup`, signupTeacher);

//Get all Method
router.get(`/getAll`, getAllTechers);

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
  try {
    const data = await TeacherModel.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

//Update by ID Method
router.put('/update/:id', updateTeacherData);

//Delete by ID Method
router.delete('/delete/:id', deleteTeacher);

module.exports = router;