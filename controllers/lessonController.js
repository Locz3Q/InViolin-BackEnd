const LessonModel = require('../server/models/lessons');
const StudentModel = require('../server/models/student');
const TeacherModel = require('../server/models/teacher');

const asyncHandler = require('express-async-handler')

const getLessons = asyncHandler(async (req, res) => {
  try {
    const { ids } = req.query;
    const splitIds = ids.split('-');
    const data = await LessonModel.find({ _id: { $in: splitIds } }, '-password');
    res.json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const addLesson = asyncHandler(async (req, res) => {
  try {
    const {teacher, student, date, topic, isRemote} = req.body;
    if(!teacher || !student || !date || !topic) {
      res.status(400);
      throw new Error('Please fill all fields');
    }
    const studentExist = await StudentModel.findById(student);
    const teacherExist = await TeacherModel.findById(teacher);

    const dateStudentExist = await LessonModel.findOne({student: student, date: date});
    const dateTeacherExist = await LessonModel.findOne({student: teacher, date: date});
    
    if(!studentExist) {
      res.status(400);
      throw new Error('Student nie istnieje');
    }
    if(!teacherExist) {
      res.status(400);
      throw new Error('Nauczyciel nie istnieje');
    }
    if(dateStudentExist) {
      res.status(400);
      throw new Error('Student ma już lekcję o tej porze');
    }
    if(dateTeacherExist) {
      res.status(400);
      throw new Error('Masz już lekcję o tej porze');
    }

    const lesson = await LessonModel.create({
      teacher, 
      student, 
      date, 
      topic, 
      isRemote
    });

    const dataTeacher = await TeacherModel.findOneAndUpdate(
      { _id: teacher },
      { $push: { lessons: lesson } },
      { new: true }
    );

    const dataStudent = await StudentModel.findOneAndUpdate(
      { _id: student },
      { $push: { lessons: lesson } },
      { new: true }
    );
    if(!dataTeacher || !dataStudent) {
      res.status(400);
      throw new Error('Użytkownik nie istnieje');
    }
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const deleteLesson = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const data = await LessonModel.findById(id);
    const studentId = data.student;
    const teacherId = data.teacher;

    const dataTeacher = await TeacherModel.findOneAndUpdate(
      { _id: teacherId },
      { $pull: { lessons: id } },
      { new: true }
    );

    const dataStudent = await StudentModel.findOneAndUpdate(
      { _id: studentId },
      { $pull: { lessons: id } },
      { new: true }
    );

    const dataToDelete = await LessonModel.findByIdAndDelete({_id: id});
    if(!dataToDelete) {
      res.status(400);
      throw new Error('Dokument nie istnieje');
    }
    if(!dataTeacher || !dataStudent) {
      res.status(400);
      throw new Error('Użytkownik nie istnieje');
    }
    const toRes = await LessonModel.find({ teacher: teacherId });
    res.json(toRes);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
})

module.exports = {getLessons, addLesson, deleteLesson}