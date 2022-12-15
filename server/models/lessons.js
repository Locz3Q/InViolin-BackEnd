const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new mongoose.Schema({
  student: {
    type: Schema.Types.ObjectId,
    require: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    require: true
  },
  date: {
    type: Schema.Types.Date,
    require: true
  },
  remote: {
    type: Boolean,
    require: true
  }
})

module.exports = mongoose.model('Lessons', lessonSchema);