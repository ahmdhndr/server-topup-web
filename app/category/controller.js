const Category = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };
      const category = await Category.find();
      res.render('admin/category/view_category', {
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
      res.render('admin/category/create');
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

      req.flash('alertMessage', 'Kategori berhasil ditambahkan');
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
      const { id } = req.params;
      const category = await Category.findById({ _id: id });
      res.render('admin/category/edit', {
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

      req.flash('alertMessage', 'Kategori berhasil diubah');
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

      req.flash('alertMessage', 'Kategori berhasil dihapus');
      req.flash('alertStatus', 'success');

      res.redirect('/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
};
