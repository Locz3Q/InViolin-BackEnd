const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const queue = new Schema({
  student: {
    require: true,
    type: Schema.Types.ObjectId,
    ref: "Students"
  },
  teacher: {
    require: true,
    type: Schema.Types.ObjectId,
    ref: "Teachers"
  },
  context: {
    require: true,
    type: String
  },
  approve: {
    require: true,
    default: undefined,
    type: Boolean
  }
}, {timestamps: true})

module.exports = mongoose.model('queue', queue);