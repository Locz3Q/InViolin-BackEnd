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
      throw new Error('Wypełnij wszystkie pola!');
    }

    const userExist = (await StudentModel.findOne({ email }) 
                        || await StudentModel.findOne({ username })
                        || await TeacherModel.findOne({ email })
                        || await TeacherModel.findOne({ username }));

    if(userExist) {
      res.status(400);
      throw new Error('Użytkownik o takim emailu lub nazwie lub istnieje');
    };

    const hashedPassword = await hashPassword(password);
    
    const teacher = await TeacherModel.create({
      email,
      username,
      password: hashedPassword,
      name,
      surname,
      level,
      isTeacher,
      students: [],
      lessons: []
    })

    if(teacher) {
      res.status(201).json({
        _id: teacher.id,
        email: teacher.email,
        username: teacher.username,
        name: teacher.name,
        surname: teacher.surname,
        level: teacher.level,
        token: generateToken(teacher._id),
        isTeacher: teacher.isTeacher,
        students: [],
        lessons: []
      });
    } else {
      res.status(400)
      throw new Error('Coś poszło nie tak')
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
        _id: teacher.id,
        email: teacher.email,
        username: teacher.username,
        name: teacher.name,
        surname: teacher.surname,
        level: teacher.level,
        token: generateToken(teacher._id),
        isTeacher: teacher.isTeacher,
        students: teacher.students
      });
    } else {
      res.status(400)
      throw new Error('Niepoprawna nazwa użytkownika lub hasło');
    }
  } catch (error) {
    throw new Error(error);
  }
})

const getMe = asyncHandler(async (req, res) => {
  try {
    const data = await TeacherModel.findById(req.user.id, '-password').lean();
    const token = req.headers.authorization.split(' ')[1];
    const concatData = { ...data, token};
    res.status(200).json(concatData);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const getAll = asyncHandler(async (req, res) => {
  try {
    const data = await TeacherModel.find({}, '-password');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const getByUsername = asyncHandler(async (req, res) => {
  try {
    const {username} = req.body;
    const data = await TeacherModel.findOne({username});
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

const getbyID = asyncHandler(async (req, res) => {
  try {
    const ID = req.params.id;
    const data = await TeacherModel.findById(ID, '-password -students');
    res.json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const pushStudent = asyncHandler(async (req, res) => {
  try {
    const {studentId} = req.body;
    const teacherId = req.params.id

    if(!studentId) {
      res.status(400);
      throw new Error('Podaj ID studenta');
    }

    if(!teacherId) {
      res.status(400);
      throw new Error('Zaloguj się');
    }

    const existingStudent = await StudentModel.findById(studentId);
    if(!existingStudent) {
      res.status(400);
      throw new Error('Student nie istnieje');
    }
    // if(existingStudent.teacher) {
    //   res.status(400);
    //   throw new Error('Student ma już nauczyciela');
    // }
  
    const data = await TeacherModel.findOneAndUpdate(
      { _id: teacherId, students: { $ne: studentId } },
      { $push: { students: studentId } },
      { new: true }
    );
    if(!data) {
      res.status(400);
      throw new Error('Student jest już zapisany u nauczyciela');
    }
    const dataToRes = await TeacherModel.findById(teacherId);
    res.status(200).json(dataToRes.students);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}


module.exports = { registerTeacher, loginTeacher, getMe, getAll, getByUsername, pushStudent, getbyID };