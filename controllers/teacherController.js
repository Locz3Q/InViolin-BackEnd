

const TeacherModel = require('../server/models/teacher');
const StudentModel = require('../server/models/student');
const asyncHandler = require('express-async-handler');
// login teacher
const loginTeacher = async (req, res) => {
  res.json({msg: "login teacher"})
}

// signup teacher
const signupTeacher = async (req, res) => {
  const {email, username, password, name, surname, teach_level} = req.body;
  // const data = new TeacherModel({
  //   email: req.body.email,
  //   username: req.body.username,
  //   password: req.body.password,
  //   name: req.body.name,
  //   surname: req.body.surname,
  //   teach_level: req.body.teach_level
  // });
  try{
    const teacher = await TeacherModel.signup(email, username, password, name, surname, teach_level);
    // const dataToSave = await data.save();
    res.status(200).json(teacher);
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
}

const getAllTechers = async (req, res) => {
  try {
    const data = await TeacherModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const updateTeacherData = asyncHandler(async (req, res) => {
  const Teacher = await TeacherModel.findById(req.params.id);
  if(!Teacher) {
    res.status(400);
    throw new Error('Nie ma takiego nauczyciela');
  }
  try{
    const updatedTeacher = await TeacherModel.findByIdAndUpdate(req.params.id, req.body, {new: false});
    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

const deleteTeacher = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const dataToDelete = await TeacherModel.findByIdAndDelete(id);
    res.send(`Document with ${dataToDelete.name} has been deleted..`)
  } catch(error) {
    res.status(400).json({message: error.message});
  }
})

module.exports = {loginTeacher, signupTeacher, getAllTechers, updateTeacherData, deleteTeacher}