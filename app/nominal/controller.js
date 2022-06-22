const Nominal = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };
      const nominal = await Nominal.find();
      res.render('admin/nominal/view_nominal', {
        nominal,
        alert,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/nominal');
    }
  },
  createNominalView: async (req, res) => {
    try {
      res.render('admin/nominal/create');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/nominal');
    }
  },
  createNominalHandler: async (req, res) => {
    try {
      const { coinQty, coinName, price } = req.body;
      const nominal = await Nominal({ coinQty, coinName, price });
      await nominal.save();

      req.flash('alertMessage', 'Data nominal berhasil ditambahkan');
      req.flash('alertStatus', 'success');

      res.redirect('/nominal');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/nominal');
    }
  },
  editNominalView: async (req, res) => {
    try {
      const { id } = req.params;
      const nominal = await Nominal.findById({ _id: id });
      res.render('admin/nominal/edit', {
        nominal,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/nominal');
    }
  },
  editNominalHandler: async (req, res) => {
    try {
      const { id } = req.params;
      const { coinQty, coinName, price } = req.body;
      await Nominal.findByIdAndUpdate({ _id: id }, { coinQty, coinName, price });

      req.flash('alertMessage', 'Data nominal berhasil diubah');
      req.flash('alertStatus', 'success');

      res.redirect('/nominal');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/nominal');
    }
  },
  deleteNominalHandler: async (req, res) => {
    try {
      const { id } = req.params;
      await Nominal.findByIdAndRemove({ _id: id });

      req.flash('alertMessage', 'Data nominal berhasil dihapus');
      req.flash('alertStatus', 'success');

      res.redirect('/nominal');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/nominal');
    }
  },
};
