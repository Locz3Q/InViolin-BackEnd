const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const validator = require('express-validator')
const Schema = mongoose.Schema;

const teacher = new mongoose.Schema({
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
  students: [{
    type: Schema.Types.ObjectId,
    ref: "Student"
  }],
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

teacher.statics.signup = async function(email, username, password, name, surname, teach_level) {
  if (!email || !password) {
    throw Error('Wszystkie pola muszą być wypełnione');
  }
  // if (!validator.isEmail(email)) {
  //   throw Error('Błędny email');
  // }
  // if (!validator.isStrongPassword(password)) {
  //   throw Error('Hasło za słabe');
  // }
  
  const exists = await this.findOne({ email });

  if(exists) {
    throw Error("Podany email jest juz zarejestrowany");
  }

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  const teacher = await this.create({ email, password: hash, username, name, surname, teach_level});
  return teacher;
}

module.exports = mongoose.model('Teachers', teacher);

