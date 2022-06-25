/* eslint-disable func-names */
/* eslint-disable no-return-await */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, 'Email tidak boleh kosong'],
  },
  name: {
    type: String,
    require: [true, 'Nama tidak boleh kosong'],
  },
  phoneNumber: {
    type: String,
    require: [true, 'Nomor telepon tidak boleh kosong'],
  },
  password: {
    type: String,
    require: [true, 'Kata sandi tidak boleh kosong'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin',
  },
  status: {
    type: String,
    enum: ['Y', 'N'],
    default: 'Y',
  },
}, { timestamps: true });

// eslint-disable-next-line arrow-body-style
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
