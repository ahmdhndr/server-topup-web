const Transaction = require('../transaction/model');
const Voucher = require('../voucher/model');
const Player = require('../player/model');
const Category = require('../category/model');

module.exports = {
  index: async (req, res) => {
    try {
      const transaction = await Transaction.countDocuments();
      const voucher = await Voucher.countDocuments();
      const player = await Player.countDocuments();
      const category = await Category.countDocuments();
      const { user } = req.session;
      res.render('admin/dashboard/view_dashboard', {
        name: user.name,
        title: 'Top Up Web | Halaman Dashboard',
        count: {
          transaction,
          voucher,
          player,
          category,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
};
