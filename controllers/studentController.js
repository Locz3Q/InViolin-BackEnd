const StudentModel = require('../server/models/student');
const TeacherModel = require('../server/models/teacher');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const {hashPassword} = require('./encodeController');
const jwt = require('jsonwebtoken');

const registerStudent = asyncHandler(async (req, res) => {
  try {
    const { email, username, password, name, surname, level, isTeacher } = req.body;

    if(!email || !username || !password || !name || !surname || !level) {
      res.status(400);
      throw new Error('Please fill all fields');
    }

    const userExist = (await StudentModel.findOne({ email }) 
                        || await StudentModel.findOne({ username })
                        || await TeacherModel.findOne({ email })
                        || await TeacherModel.findOne({ username }));

    if(userExist) {
      res.status(400);
      throw new Error('User already exists');
    };

    const hashedPassword = await hashPassword(password);
    
    const student = await StudentModel.create({
      email,
      username,
      password: hashedPassword,
      name,
      surname,
      level,
      isTeacher
    });

    if(student) {
      res.status(201).json({
        email: student.email,
        username: student.username,
        name: student.name,
        surname: student.surname,
        level: student.level,
        token: generateToken(student._id),
        isTeacher: student.isTeacher
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({message: error.message});
  }
})

const loginStudent = asyncHandler(async (req, res) => {
  try{
    const {username, password} = req.body;
    const student = await StudentModel.findOne({username});
    if(student && (await bcrypt.compare(password, student.password))) {
      res.json({
        email: student.email,
        username: student.username,
        name: student.name,
        surname: student.surname,
        level: student.level,
        token: generateToken(student._id),
        isTeacher: student.isTeacher
      });
    } else {
      res.status(400);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    throw new Error(error);
  }
})

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
})

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

module.exports = { registerStudent, loginStudent, getMe };