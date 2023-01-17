const queueModel = require('../server/models/queue');
const StudentModel = require('../server/models/student');
const TeacherModel = require('../server/models/teacher');

const asyncHandler = require('express-async-handler');

const getQueue = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const studentExist = await StudentModel.findById(id);
    const teacherExist = await TeacherModel.findById(id);
  
    let queue;
    if(teacherExist) {
      queue = await queueModel.find({ teacher: id });
    }
    if(studentExist) {
      queue = await queueModel.find({ student: id });
      queue.length !== 0 ? res.status(400).json({message: 'Można wysłać tylko jedną prośbę'}) : res.status(200).json(queue);
    }
    res.status(200).json(queue);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
})

const deleteQueue = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const dataToDelete = await queueModel.findByIdAndDelete(id);
    if(!dataToDelete) {
      res.status(400);
      throw new Error('Dokument nie istnieje');
    }
    const toRes = await queueModel.find();
    res.json(toRes);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
})

const createqueue = asyncHandler(async (req, res) => {
  try {
    const { student, context, teacher } = req.body;
    
    if(!student || !teacher || !context) {
      res.status(400);
      throw new Error('Coś poszło nie tak');
    }
    
    const studentExist = await StudentModel.findById(student);
    const teacherExist = await TeacherModel.findById(teacher);

    const documentExist = await queueModel.findOne({student: student});
    if(!studentExist) {
      res.status(400);
      throw new Error('student doesn\'t exists');
    }
    if(!teacherExist) {
      res.status(400);
      throw new Error('teacher doesn\'t exists');
    }
    if(documentExist) {
      res.status(400);
      throw new Error('Można wysłać tylko jedną prośbę');
    }

    const queue = await queueModel.create({
      student,
      teacher,
      context,
      approve: false
    })

    if(queue) {
      res.status(201).json({
        student: queue.student,
        teacher: queue.teacher,
        context: queue.context,
        approve: false
      })
    } else {
      res.status(400);
      throw new Error('Invalid queue data');
    }
  } catch (error) {
    res.status(400).json({message: error.message});
  }
})

module.exports = {createqueue, getQueue, deleteQueue};