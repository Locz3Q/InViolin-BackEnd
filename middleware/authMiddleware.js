const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const StudentModel = require('../server/models/student');
const TeacherModel = require('../server/models/teacher');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await StudentModel.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }
  if(!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
})

const protectBoth = asyncHandler(async (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await StudentModel.findById(decoded.id).select('-password') ? await StudentModel.findById(decoded.id).select('-password') : await TeacherModel.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }
  if(!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
})

const protectTeacher = asyncHandler(async (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await TeacherModel.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }
  if(!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
})

module.exports = { protect, protectTeacher, protectBoth };