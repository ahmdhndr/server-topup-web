const path = require('path');
const fs = require('fs');
const Voucher = require('./model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const config = require('../../config');

module.exports = {
  index: async (req, res) => {
    try {
      const { user } = req.session;
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const alert = { message: alertMessage, status: alertStatus };
      const voucher = await Voucher.find()
        .populate('category')
        .populate('nominals');
      res.render('admin/voucher/view_voucher', {
        title: 'Top Up Web | Halaman Voucher',
        name: user.name,
        voucher,
        alert,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
  createVoucherView: async (req, res) => {
    try {
      const { user } = req.session;
      const category = await Category.find();
      const nominals = await Nominal.find();
      res.render('admin/voucher/create', {
        title: 'Top Up Web | Tambah Data Voucher',
        name: user.name,
        category,
        nominals,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
  createVoucherHandler: async (req, res) => {
    try {
      const { name, category, nominals } = req.body;

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
            const voucher = new Voucher({
              name,
              category,
              nominals,
              thumbnail: filename,
            });

            await voucher.save();

            req.flash('alertMessage', 'Data voucher berhasil ditambahkan');
            req.flash('alertStatus', 'success');
            res.redirect('/voucher');
          } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
          }
        });
      } else {
        const voucher = new Voucher({
          name,
          category,
          nominals,
        });

        await voucher.save();

        req.flash('alertMessage', 'Data voucher berhasil ditambahkan');
        req.flash('alertStatus', 'success');

        res.redirect('/voucher');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
  editVoucherView: async (req, res) => {
    try {
      const { user } = req.session;
      const { id } = req.params;
      const category = await Category.find();
      const nominals = await Nominal.find();
      const voucher = await Voucher.findById({ _id: id })
        .populate('category')
        .populate('nominals');
      res.render('admin/voucher/edit', {
        title: 'Top Up Web | Ubah Data Voucher',
        name: user.name,
        voucher,
        category,
        nominals,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
  editVoucherHandler: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, nominals } = req.body;

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
            const voucher = await Voucher.findById({ _id: id });

            const currentThumbnail = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

            if (fs.existsSync(currentThumbnail)) {
              fs.unlinkSync(currentThumbnail);
            }

            await Voucher.findOneAndUpdate({ _id: id }, {
              name,
              category,
              nominals,
              thumbnail: filename,
            });

            req.flash('alertMessage', 'Data voucher berhasil diubah');
            req.flash('alertStatus', 'success');
            res.redirect('/voucher');
          } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
          }
        });
      } else {
        await Voucher.findOneAndUpdate({ _id: id }, {
          name,
          category,
          nominals,
        });

        req.flash('alertMessage', 'Data voucher berhasil diubah');
        req.flash('alertStatus', 'success');

        res.redirect('/voucher');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
  deleteVoucherHandler: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findByIdAndRemove({ _id: id });

      const currentThumbnail = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

      if (fs.existsSync(currentThumbnail)) {
        fs.unlinkSync(currentThumbnail);
      }

      req.flash('alertMessage', 'Data voucher berhasil dihapus');
      req.flash('alertStatus', 'success');

      res.redirect('/voucher');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
  updateStatusVoucherHandler: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id });
      const status = voucher.status === 'Y' ? 'N' : 'Y';
      await Voucher.findOneAndUpdate({ _id: id }, { status });

      req.flash('alertMessage', 'Status voucher berhasil diubah');
      req.flash('alertStatus', 'success');

      res.redirect('/voucher');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
};
