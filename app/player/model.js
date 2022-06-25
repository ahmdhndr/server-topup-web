/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const HASH_ROUND = 10;

const playerSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, 'Email tidak boleh kosong'],
  },
  name: {
    type: String,
    require: [true, 'Nama tidak boleh kosong'],
    maxLength: [225, 'Panjang nama harus diantara 9 - 225 karakter'],
    minLength: [9, 'Panjang nama harus diantara 9 - 225 karakter'],
  },
  username: {
    type: String,
    require: [true, 'Username tidak boleh kosong'],
    maxLength: [13, 'Panjang username harus diantara 9 - 13 karakter'],
    minLength: [9, 'Panjang username harus diantara 9 - 13 karakter'],
  },
  password: {
    type: String,
    require: [true, 'Kata sandi tidak boleh kosong'],
    maxLength: [225, 'Panjang password harus diantara 8 - 225 karakter'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['Y', 'N'],
    default: 'Y',
  },
  avatar: {
    type: String,
  },
  fileName: {
    type: String,
  },
  phoneNumber: {
    type: String,
    require: [true, 'Nomor telepon tidak boleh kosong'],
    maxLength: [13, 'Nomor harus diantara 9 - 13 digit'],
    minLength: [9, 'Nomor harus diantara 9 - 13 digit'],
  },
  favorite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
}, { timestamps: true });

playerSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

module.exports = mongoose.model('Player', playerSchema);
