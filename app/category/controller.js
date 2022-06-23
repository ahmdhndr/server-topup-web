const Category = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const { user } = req.session;
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };
      const category = await Category.find();
      res.render('admin/category/view_category', {
        title: 'Top Up Web | Halaman Kategori',
        name: user.name,
        category,
        alert,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
  createCategoryView: async (req, res) => {
    try {
      const { user } = req.session;
      res.render('admin/category/create', {
        title: 'Top Up Web | Tambah Data Kategori',
        name: user.name,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
  createCategoryHandler: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category({ name });
      await category.save();

      req.flash('alertMessage', 'Data kategori berhasil ditambahkan');
      req.flash('alertStatus', 'success');

      res.redirect('/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
  editCategoryView: async (req, res) => {
    try {
      const { user } = req.session;
      const { id } = req.params;
      const category = await Category.findById({ _id: id });
      res.render('admin/category/edit', {
        title: 'Top Up Web | Ubah Data Kategori',
        name: user.name,
        category,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
  editCategoryHandler: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await Category.findByIdAndUpdate({ _id: id }, { name });

      req.flash('alertMessage', 'Data kategori berhasil diubah');
      req.flash('alertStatus', 'success');

      res.redirect('/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
  deleteCategoryHandler: async (req, res) => {
    try {
      const { id } = req.params;
      await Category.findByIdAndRemove({ _id: id });

      req.flash('alertMessage', 'Data kategori berhasil dihapus');
      req.flash('alertStatus', 'success');

      res.redirect('/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
};
