const LessonModel = require('../server/models/lessons');
const asyncHandler = require('express-async-handler')

const getLessons = asyncHandler(async (req, res) => {
  try {
    const data = await LessonModel.find({ user: req.user.id });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const addLesson = asyncHandler(async (req, res) => {
  try {
    const {teacher, student, date, isRemote} = req.body;
    if(!teacher || !student || !date) {
      res.status(400);
      throw new Error('Please fill all fields');
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

