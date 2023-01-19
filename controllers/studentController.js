const StudentModel = require('../server/models/student');
const TeacherModel = require('../server/models/teacher');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const {hashPassword} = require('./encodeController');
const jwt = require('jsonwebtoken');

const registerStudent = asyncHandler(async (req, res) => {
  try {
    const { email, username, password, name, surname, level, isTeacher, teacher } = req.body;
    
    if(!email || !username || !password || !name || !surname || (level < 0 || level > 10)) {
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
    
    const student = await StudentModel.create({
      email,
      username,
      password: hashedPassword,
      name,
      surname,
      level,
      isTeacher,
      teacher: null,
      lessons: []
    });

    if(student) {
      res.status(201).json({
        _id: student.id,
        email: student.email,
        username: student.username,
        name: student.name,
        surname: student.surname,
        level: student.level,
        token: generateToken(student._id),
        isTeacher: student.isTeacher,
        lessons: [],
        teacher: null
      });
    } else {
      res.status(400);
      throw new Error('Niepoprawna nazwa użytkownika lub hasło');
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
        _id: student.id,
        email: student.email,
        username: student.username,
        name: student.name,
        surname: student.surname,
        level: student.level,
        token: generateToken(student._id),
        isTeacher: student.isTeacher,
        teacher: student.teacher,
        lessons: student.lessons
      });
    } else {
      res.status(400);
      throw new Error('Niepoprawna nazwa użytkownika lub hasło');
    }
  } catch (error) {
    throw new Error(error);
  }
})

const getMe = asyncHandler(async (req, res) => {
  try {
    const data = await StudentModel.findById(req.user.id, '-password').lean();
    const token = req.headers.authorization.split(' ')[1];
    const concatData = { ...data, token};
    res.status(200).json(concatData);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const addTeacher = asyncHandler(async (req, res) => {
  try {
    const { teacherId } = req.body;
    const studentId = req.params.id;
    console.log(teacherId)
    if(!studentId) {
      res.status(400);
      throw new Error('Zaloguj się');
    }
    if(!teacherId) {
      res.status(400);
      throw new Error('Wprowadz ID nauczyciela');
    }
    
    const existingStudent = await StudentModel.findById(studentId);
    if(!existingStudent) {
      res.status(400);
      throw new Error('Student nie istnieje');
    }
    if(existingStudent.teacher) {
      res.status(400);
      throw new Error('Student ma już nauczyciela');
    }
    

    // FIXME: Dodawanie nauczyciela do ucznia nie działa
    const data = await StudentModel.findByIdAndUpdate(studentId, {teacher: teacherId}, {new: true, upsert: true})
    console.log(data.teacher + ' ' + teacherId);
    if(!data) {
      res.status(400);
      throw new Error('Student jest już zapisany u nauczyciela');
    }

    const teacherStudents = await TeacherModel.findById(teacherId);
    const studentsArrayIds = teacherStudents.students.map(id => id.toString());
    studentsArrayIds.push(studentId)
    const studentsArray = await StudentModel.find({ _id: { $in: studentsArrayIds } }, '-password -username');

    res.status(200).json(studentsArray);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const getStudentsByID = asyncHandler(async (req, res) => {
  try {
    const { ids } = req.query;
    const splitIds = ids.split('-');
    const data = await StudentModel.find({ _id: { $in: splitIds } }, '-password');
    res.json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

module.exports = { registerStudent, loginStudent, getMe, addTeacher, getStudentsByID };