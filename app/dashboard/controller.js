module.exports = {
  index: async (req, res) => {
    try {
      const { user } = req.session;
      res.render('index', {
        name: user.name,
        title: 'Top Up Web | Halaman Dashboard',
      });
    } catch (error) {
      console.log(error);
    }
  },
};
