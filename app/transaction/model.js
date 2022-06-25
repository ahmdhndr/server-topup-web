const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  historyVoucherTopup: {
    gameName: { type: String, require: [true, 'Nama game tidak boleh kosong'] },
    category: { type: String, require: [true, 'Nama kategori tidak boleh kosong'] },
    thumbnail: { type: String },
    coinName: { type: String, require: [true, 'Nama koin tidak boleh kosong'] },
    coinQty: { type: String, require: [true, 'Jumlah koin tidak boleh kosong'] },
    price: { type: Number },
  },
  historyPayment: {
    name: { type: String, require: [true, 'Nama tidak boleh kosong'] },
    type: { type: String, require: [true, 'Tipe pembayaran tidak boleh kosong'] },
    bankName: { type: String, require: [true, 'Nama bank tidak boleh kosong'] },
    accountNumb: { type: String, require: [true, 'Nomor rekening boleh kosong'] },
  },
  name: {
    type: String,
    require: [true, 'Nama tidak boleh kosong'],
    maxLength: [225, 'Panjang nama harus diantara 3 - 22 karakter'],
    minLength: [3, 'Panjang nama harus diantara 3 - 22 karakter'],
  },
  userAccount: {
    type: String,
    require: [true, 'Nama akun tidak boleh kosong'],
    maxLength: [225, 'Panjang nama harus diantara 3 - 22 karakter'],
    minLength: [3, 'Panjang nama harus diantara 3 - 22 karakter'],
  },
  tax: {
    type: Number,
    default: 0,
  },
  value: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
  },
  historyUser: {
    name: { type: String, require: [true, 'Nama player tidak boleh kosong'] },
    phoneNumber: {
      type: String,
      require: [true, 'Nama akun tidak boleh kosong'],
      maxLength: [13, 'Nomor harus diantara 9 - 13 digit'],
      minLength: [9, 'Nomor harus diantara 9 - 13 digit'],
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
