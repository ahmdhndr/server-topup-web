const express = require('express');
const multer = require('multer');
const os = require('os');

const router = express.Router();
const {
  index,
  createVoucherView,
  createVoucherHandler,
  editVoucherView,
  editVoucherHandler,
  deleteVoucherHandler,
  updateStatusVoucherHandler,
} = require('./controller');

router.get('/', index);
router.get('/create', createVoucherView);
router.post('/create', multer({ dest: os.tmpdir() }).single('thumbnail'), createVoucherHandler);
router.get('/edit/:id', editVoucherView);
router.put('/edit/:id', multer({ dest: os.tmpdir() }).single('thumbnail'), editVoucherHandler);
router.delete('/delete/:id', deleteVoucherHandler);
router.put('/status/:id', updateStatusVoucherHandler);

module.exports = router;
