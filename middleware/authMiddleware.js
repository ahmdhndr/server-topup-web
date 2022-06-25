const jwt = require('jsonwebtoken');
const Player = require('../app/player/model');
const config = require('../config');

module.exports = {
  isLogin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash('alertMessage', 'Sesi Anda telah berakhir, silakan masuk kembali');
      req.flash('alertStatus', 'danger');
      res.redirect('/');
    } else {
      next();
    }
  },
  protect: async (req, res, next) => {
    try {
      const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;

      const data = jwt.verify(token, config.jwtKey);

      const player = await Player.findOne({ _id: data.id }).select('-password');

      if (!player) {
        throw new Error();
      }

      req.player = player;
      req.token = token;
      next();
    } catch (err) {
      res.status(401).json({
        error: 'Anda tidak diijinkan mengakses ini!',
      });
    }
  },
};
