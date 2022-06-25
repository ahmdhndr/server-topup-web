const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Player = require('../player/model');
const config = require('../../config');

module.exports = {
  signup: async (req, res, next) => {
    try {
      const payload = req.body;
      const { email } = payload;

      const userExists = await Player.findOne({ email });
      if (userExists) {
        res.status(400).json({
          message: 'Akun telah digunakan',
        });
      }

      if (req.file) {
        const tempPath = req.file.path;
        const originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
        const filename = `${req.file.filename}.${originalExt}`;
        const targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`);

        const src = fs.createReadStream(tempPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);

        src.on('end', async () => {
          try {
            const player = new Player({
              ...payload,
              email,
              avatar: filename,
            });

            await player.save();

            delete player._doc.password;
            res.status(201).json({
              data: player,
            });
          } catch (err) {
            if (err && err.message === 'ValidationError') {
              res.status(422).json({
                error: 1,
                message: err.message,
                fields: err.errors,
              });
            }
            next(err);
          }
        });
      } else {
        const player = new Player({
          ...payload,
          email,
        });

        await player.save();

        delete player._doc.password;
        res.status(201).json({
          data: player,
        });
      }
    } catch (err) {
      if (err && err.message === 'ValidationError') {
        res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
      next(err);
    }
  },
  signin: async (req, res, next) => {
    const { email, password } = req.body;

    Player.findOne({ email })
      .then((player) => {
        if (player) {
          const checkPassword = bcrypt.compareSync(password, player.password);
          if (checkPassword) {
            const token = jwt.sign({
              id: player.id,
              username: player.username,
              email: player.email,
              name: player.name,
              phoneNumber: player.phoneNumber,
              avatar: player.avatar,
            }, config.jwtKey);

            res.status(200).json({
              data: { token },
            });
          } else {
            res.status(403).json({
              message: 'Kata sandi yang Anda masukkan salah',
            });
          }
        } else {
          res.status(403).json({
            message: 'Email yang Anda masukkan belum terdaftar',
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: error.message || 'Terjadi kesalahan pada server',
        });

        next();
      });
  },
};
