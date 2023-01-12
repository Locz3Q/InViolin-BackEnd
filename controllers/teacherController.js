const TeacherModel = require('../server/models/teacher');
const StudentModel = require('../server/models/student');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const {hashPassword} = require('./encodeController');
const jwt = require('jsonwebtoken');

const registerTeacher = asyncHandler(async (req, res) => {
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
    
    const teacher = await TeacherModel.create({
      email,
      username,
      password: hashedPassword,
      name,
      surname,
      level,
      isTeacher
    })

    if(teacher) {
      res.status(201).json({
        email: teacher.email,
        username: teacher.username,
        name: teacher.name,
        surname: teacher.surname,
        level: teacher.level,
        token: generateToken(teacher._id),
        isTeacher: teacher.isTeacher
      });
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  } catch (error) {
    res.status(400).json({message: error.message});
  }
})

const loginTeacher = asyncHandler(async (req, res) => {
  try{
    const {username, password} = req.body;
    const teacher = await TeacherModel.findOne({username});
    if(teacher && (await bcrypt.compare(password, teacher.password))) {
      res.json({
        email: teacher.email,
        username: teacher.username,
        name: teacher.name,
        surname: teacher.surname,
        level: teacher.level,
        token: generateToken(teacher._id),
        isTeacher: teacher.isTeacher
      });
    } else {
      res.json({login: false});
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    throw new Error(error);
  }
})

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
})

const getAll = asyncHandler(async (req, res) => {
  try {
    const data = await TeacherModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const getByUsername = asyncHandler(async (req, res) => {
  try {
    const {username} = req.body;
    console.log(username);
    const data = await TeacherModel.findOne({username});
    //console.log(data);
    if(data) {
      res.status(200).json({success: true});
    }
    else {
      res.status(200).json({success: false});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}


module.exports = { registerTeacher, loginTeacher, getMe, getAll, getByUsername };