const TeacherModel = require('../server/models/teacher');
const StudentModel = require('../server/models/student');

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

module.exports = {loginTeacher, signupTeacher}