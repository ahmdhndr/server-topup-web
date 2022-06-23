const Bank = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const { user } = req.session;
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };
      const bank = await Bank.find();
      res.render('admin/bank/view_bank', {
        title: 'Top Up Web | Halaman Bank',
        name: user.name,
        bank,
        alert,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    }
  },
  createBankView: async (req, res) => {
    try {
      const { user } = req.session;
      res.render('admin/bank/create', {
        title: 'Top Up Web | Tambah Data Bank',
        name: user.name,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    }
  },
  createBankHandler: async (req, res) => {
    try {
      const { ownerName, bankName, accountNumb } = req.body;
      const bank = await Bank({ ownerName, bankName, accountNumb });
      await bank.save();

      req.flash('alertMessage', 'Data bank berhasil ditambahkan');
      req.flash('alertStatus', 'success');

      res.redirect('/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    }
  },
  editBankView: async (req, res) => {
    try {
      const { user } = req.session;
      const { id } = req.params;
      const bank = await Bank.findById({ _id: id });
      res.render('admin/bank/edit', {
        title: 'Top Up Web | Ubah Data Bank',
        name: user.name,
        bank,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    }
  },
  editBankHandler: async (req, res) => {
    try {
      const { id } = req.params;
      const { ownerName, bankName, accountNumb } = req.body;
      await Bank.findByIdAndUpdate({ _id: id }, { ownerName, bankName, accountNumb });

      req.flash('alertMessage', 'Data bank berhasil diubah');
      req.flash('alertStatus', 'success');

      res.redirect('/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    }
  },
  deleteBankHandler: async (req, res) => {
    try {
      const { id } = req.params;
      await Bank.findByIdAndRemove({ _id: id });

      req.flash('alertMessage', 'Data bank berhasil dihapus');
      req.flash('alertStatus', 'success');

      res.redirect('/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    }
  },
};
