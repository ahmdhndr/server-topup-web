const Payment = require('./model');
const Bank = require('../bank/model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };

      const payment = await Payment.find().populate('banks');

      res.render('admin/payment/view_payment', {
        payment,
        alert,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'success');
      res.redirect('/payment');
    }
  },
  createPaymentView: async (req, res) => {
    try {
      const banks = await Bank.find();
      res.render('admin/payment/create', { banks });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
  createPaymentHandler: async (req, res) => {
    try {
      const { paymentType, banks } = req.body;
      const payment = await Payment({ paymentType, banks });
      await payment.save();

      req.flash('alertMessage', 'Data jenis pembayaran berhasil ditambahkan');
      req.flash('alertStatus', 'success');

      res.redirect('/payment');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
  editPaymentView: async (req, res) => {
    try {
      const { id } = req.params;
      const banks = await Bank.find();
      const payment = await Payment.findById({ _id: id }).populate('banks');
      res.render('admin/payment/edit', {
        payment,
        banks,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
  editPaymentHandler: async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentType, banks } = req.body;
      await Payment.findByIdAndUpdate({ _id: id }, { paymentType, banks });

      req.flash('alertMessage', 'Data jenis pembayaran berhasil diubah');
      req.flash('alertStatus', 'success');

      res.redirect('/payment');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
  deletePaymentHandler: async (req, res) => {
    try {
      const { id } = req.params;
      await Payment.findByIdAndRemove({ _id: id });

      req.flash('alertMessage', 'Data jenis pembayaran berhasil dihapus');
      req.flash('alertStatus', 'success');

      res.redirect('/payment');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
  updateStatusPaymentHandler: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findOne({ _id: id });
      const status = payment.status === 'Y' ? 'N' : 'Y';
      await Payment.findOneAndUpdate({ _id: id }, { status });

      req.flash('alertMessage', 'Status jenis pembayaran berhasil diubah');
      req.flash('alertStatus', 'success');

      res.redirect('/payment');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
};
