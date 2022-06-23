const User = require('./model');

module.exports = {
  signinView: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user === null || req.session.user === undefined) {
        res.render('admin/users/view_signin', {
          alert,
        });
      } else {
        res.redirect('/dashboard');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/');
    }
  },
  loginUserHandler: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        req.session.user = {
          id: user._id,
          email: user.email,
          status: user.status,
          name: user.name,
        };
        res.redirect('/dashboard');
      } else {
        res.status(401);
        req.flash('alertMessage', 'Email atau kata sandi salah!');
        req.flash('alertStatus', 'danger');
        res.redirect('/');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/');
    }
  },
  logoutUserHandler: (req, res) => {
    req.session.destroy();
    res.redirect('/');
  },
};
