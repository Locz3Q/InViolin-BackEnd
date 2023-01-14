const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const queue = new Schema({
  user: {
    require: true,
    type: Schema.Types.ObjectId,
    ref: "Teachers" || "Students"
  },
  context: {
    require: true,
    type: String
  },
  toApprove: {
    require: true,
    type: Boolean
  }
}, {timestamps: true})

module.exports = mongoose.model('queue', queue);