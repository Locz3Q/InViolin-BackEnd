const queueModel = require('../server/models/queue');
const StudentModel = require('../server/models/student');
const TeacherModel = require('../server/models/teacher');

const asyncHandler = require('express-async-handler');

const getqueue = asyncHandler(async (req, res) => {
  const queue = await queueModel.find({ user: req.params.id });
  res.status(200).json(queue)
})

const createqueue = asyncHandler(async (req, res) => {
  try {
    const { user, context, toApprove } = req.body;
    
    if(!user || !context || !toApprove) {
      res.status(400);
      throw new Error('Please fill all fields');
    }
    
    const queue = await queueModel.create({
      user,
      context,
      toApprove
    })
    const userExist = (await StudentModel.findOne({user})
                        || await TeacherModel.findOne({user}));

    if(!userExist) {
      res.status(400);
      throw new Error('User doesn\'t exists');
    }

    if(queue) {
      res.status(201).json({
        user: queue.user,
        context: queue.context,
        toApprove: queue.toApprove
      })
    } else {
      res.status(400);
      throw new Error('Invalid queue data');
    }
  } catch (error) {
    res.status(400).json({message: error.message});
  }
})

module.exports = {createqueue, getqueue};