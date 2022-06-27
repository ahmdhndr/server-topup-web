const path = require('path');
const fs = require('fs');
const Player = require('./model');
const Voucher = require('../voucher/model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const Bank = require('../bank/model');
const Payment = require('../payment/model');
const Transaction = require('../transaction/model');
const config = require('../../config');

module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .select('_id name status category thumbnail')
        .populate('category');
      res.status(200).json({
        data: voucher,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Terjadi kesalahan pada server',
      });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id })
        .populate('category')
        .populate('nominals')
        .populate('user', '_id name phoneNumber');

      const payment = await Payment.find().populate('banks');

      if (!voucher) {
        res.status(404).json({ message: 'Voucher game tidak ditemukan!' });
      }

      res.status(200).json({
        data: {
          detail: voucher,
          payment,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Terjadi kesalahan pada server',
      });
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find();
      res.status(200).json({
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Terjadi kesalahan pada server',
      });
    }
  },
  checkout: async (req, res) => {
    try {
      const {
        userAccount, name, nominal, voucher, payment, bank,
      } = req.body;

      const voucherRes = await Voucher.findOne({ _id: voucher })
        .select('name category _id thumbnail user')
        .populate('category')
        .populate('user');
      if (!voucherRes) res.status(404).json({ message: 'Voucher game tidak ditemukan' });

      const nominalRes = await Nominal.findOne({ _id: nominal });
      if (!nominalRes) res.status(404).json({ message: 'Nominal tidak ditemukan' });

      const paymentRes = await Payment.findOne({ _id: payment });
      if (!paymentRes) res.status(404).json({ message: 'Jenis pembayaran tidak ditemukan' });

      const bankRes = await Bank.findOne({ _id: bank });
      if (!bankRes) res.status(404).json({ message: 'Bank tidak ditemukan' });

      const tax = (10 / 100) * nominalRes._doc.price;
      const value = +nominalRes._doc.price - +tax;

      const payload = {
        historyVoucherTopup: {
          gameName: voucherRes._doc.name,
          category: voucherRes._doc.category ? voucherRes._doc.category.name : '',
          thumbnail: voucherRes._doc.thumbnail,
          coinName: nominalRes._doc.coinName,
          coinQty: nominalRes._doc.coinQty,
          price: nominalRes._doc.price,
        },
        historyPayment: {
          name: bankRes._doc.name,
          type: paymentRes._doc.paymentType,
          bankName: bankRes._doc.bankName,
          accountNumb: bankRes._doc.accountNumb,
        },
        name,
        userAccount,
        tax,
        value,
        player: req.player._id,
        historyUser: {
          name: voucherRes._doc.user?.name,
          phoneNumber: voucherRes._doc.user?.phoneNumber,
        },
        category: voucherRes._doc.category?._id,
        user: voucherRes._doc.user?._id,
      };

      const transaction = new Transaction(payload);

      await transaction.save();

      res.status(201).json({
        data: transaction,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Terjadi kesalahan pada server',
      });
    }
  },
  historyTransaction: async (req, res) => {
    try {
      const { status = '' } = req.query;

      let criteria = {};

      if (status.length > 0) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: 'i' },
        };
      }

      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }

      const transaction = await Transaction.find(criteria);

      const total = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: '$value' },
          },
        },
      ]);

      res.status(200).json({
        data: transaction,
        total: total.length ? total[0].value : 0,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        message: error.message || 'Terjadi kesalahan pada server',
      });
    }
  },
  detailHistoryTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const detailTransaction = await Transaction.findOne({ _id: id });

      if (!detailTransaction) res.status(404).json({ message: 'Data transaksi tidak ditemukan' });

      res.status(200).json({ data: detailTransaction });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Terjadi kesalahan pada server',
      });
    }
  },
  dashboard: async (req, res) => {
    try {
      const count = await Transaction.aggregate([
        { $match: { player: req.player._id } },
        {
          $group: {
            _id: '$category',
            value: { $sum: '$value' },
          },
        },
      ]);

      const category = await Category.find();

      category.forEach((item) => {
        count.forEach((data) => {
          if (data._id.toString() === item._id.toString()) {
            // eslint-disable-next-line no-param-reassign
            data.name = item.name;
          }
        });
      });

      const history = await Transaction.find({ player: req.player._id })
        .populate('category')
        .sort({ updatedAt: -1 });

      res.status(200).json({ data: history, count });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Terjadi kesalahan pada server',
      });
    }
  },
  profile: async (req, res) => {
    try {
      const player = {
        id: req.player._id,
        username: req.player.username,
        email: req.player.email,
        name: req.player.name,
        phoneNumber: req.player.phoneNumber,
        avatar: req.player.avatar,
      };
      res.status(200).json({ data: player });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Terjadi kesalahan pada server',
      });
    }
  },
  editProfile: async (req, res, next) => {
    try {
      const { name = '', phoneNumber = '' } = req.body;
      const payload = {};

      if (name.length) payload.name = name;
      if (phoneNumber.length) payload.phoneNumber = phoneNumber;
      if (req.file) {
        const tempPath = req.file.path;
        const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        const filename = `${req.file.filename}.${originalExt}`;
        const targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`);

        const src = fs.createReadStream(tempPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);

        src.on('end', async () => {
          let player = await Player.findById({ _id: req.player._id });

          const currentAvatar = `${config.rootPath}/public/uploads/${player.avatar}`;

          if (fs.existsSync(currentAvatar)) {
            fs.unlinkSync(currentAvatar);
          }

          player = await Player.findOneAndUpdate({ _id: req.player._id }, {
            ...payload,
            avatar: filename,
          }, { new: true, runValidators: true });
          res.status(201).json({
            data: {
              id: player._id,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            },
          });
        });

        src.on('err', async () => {
          next();
        });
      } else {
        const player = await Player.findOneAndUpdate(
          { _id: req.player._id },
          payload,
          { new: true, runValidators: true },
        );

        res.status(201).json({
          data: {
            id: player._id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        });
      }
    } catch (error) {
      if (error && error.name === 'ValidationError') {
        res.status(422).json({
          error: 1,
          message: error.message,
          fields: error.errors,
        });
      }
    }
  },
};
