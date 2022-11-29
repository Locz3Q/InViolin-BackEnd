const mongoose = require('mongoose');

const student = new mongoose.Schema({
  email: {
    require:  true,
    type: String
  },
  username: {
    require:  true,
    type: String
  },
  password: {
    require:  true,
    type: String
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
