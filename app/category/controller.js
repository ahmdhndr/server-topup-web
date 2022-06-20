const Category = require('./models');

module.exports = {
  index: async (req, res) => {
    try {
      res.render('admin/category/view_category');
    } catch (error) {
      console.log(error);
    }
  },
  createCategoryView: async (req, res) => {
    try {
      res.render('admin/category/create');
    } catch (error) {
      console.log(error);
    }
  },
  createCategoryHandler: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category({ name });
      await category.save();
      res.redirect('/category');
    } catch (error) {
      console.log(error);
    }
  },
};
