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
    type: String
  },
  password: {
    require:  true,
    type: String
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "Teachers"
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
    required: false,
    type: Number
  }
}, {timestamps: true})

module.exports = mongoose.model('Students', student);
