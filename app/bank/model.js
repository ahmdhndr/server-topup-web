const mongoose = require('mongoose');

const bankSchema = mongoose.Schema({
  ownerName: {
    type: String,
    require: [true, 'Nama pemilik tidak boleh kosong'],
  },
  bankName: {
    type: String,
    require: [true, 'Nama bank tidak boleh kosong'],
  },
  accountNumb: {
    type: Number,
    require: [true, 'Nomor rekening tidak boleh kosong'],
  },
});

module.exports = mongoose.model('Bank', bankSchema);
