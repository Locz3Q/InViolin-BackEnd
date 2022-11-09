const mongoose = require('mongoose');

const teacher = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  subject: {
    required: true,
    type: String
  }
})

module.exports = mongoose.model('DataTeachers', teacher);

