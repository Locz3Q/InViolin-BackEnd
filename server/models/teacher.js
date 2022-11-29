const mongoose = require('mongoose');

const teacher = new mongoose.Schema({
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
  teach_level: {
    required: true,
    type: Number
  }
}, {timestamps: true})

module.exports = mongoose.model('Teachers', teacher);

