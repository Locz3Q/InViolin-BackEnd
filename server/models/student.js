const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const student = new mongoose.Schema({
  email: {
    require:  true,
    type: String,
    unique: true
  },
  username: {
    require:  true,
    type: String,
    unique: true
  },
  password: {
    require:  true,
    type: String
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teachers",
    default: null
  },
  name: {
    required: true,
    type: String
  },
  surname: {
    require:  true,
    type: String
  },
  level: {
    required: true,
    type: Number
  },
  isTeacher: {
    required: true,
    type: Boolean
  },
  lessons: [{
    required: false,
    type: Schema.Types.ObjectId,
    ref: "Lessons"
  }]
}, {timestamps: true})

module.exports = mongoose.model('Students', student);
