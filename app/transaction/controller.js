const Transaction = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const { user } = req.session;
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };

      const transaction = await Transaction.find().populate('player');

      res.render('admin/transaction/view_transaction', {
        title: 'Top Up Web | Halaman Transaksi',
        name: user.name,
        transaction,
        alert,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/transaction');
    }
  },
  updateStatusHandler: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;
      await Transaction.findOneAndUpdate({ _id: id }, { status });
      req.flash('alertMessage', 'Status berhasil diperbarui');
      req.flash('alertStatus', 'success');
      res.redirect('/transaction');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/transaction');
    }
  },
};
