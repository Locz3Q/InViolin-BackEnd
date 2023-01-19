const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new mongoose.Schema({
  student: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Students"
  },
  teacher: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Teachers"
  },
  topic: {
    type: String,
    require: true,
    def: 'Temat niezdefiniowany'
  },
  date: {
    type: Schema.Types.Date,
    require: true
  },
  isRemote: {
    type: Boolean,
    require: true
  }
})

module.exports = mongoose.model('Lessons', lessonSchema);