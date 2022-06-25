const express = require('express');
const multer = require('multer');
const os = require('os');

const router = express.Router();
const {
  landingPage,
  detailPage,
  category,
  checkout,
  historyTransaction,
  detailHistoryTransaction,
  dashboard,
  profile,
  editProfile,
} = require('./controller');

const { protect } = require('../../middleware/authMiddleware');

router.get('/landingpage', landingPage);
router.get('/:id/detail', detailPage);
router.get('/category', category);
router.post('/checkout', protect, checkout);
router.get('/transaction', protect, historyTransaction);
router.get('/transaction/:id/detail', protect, detailHistoryTransaction);
router.get('/dashboard', protect, dashboard);
router.get('/profile', protect, profile);
router.put('/profile', protect, multer({ dest: os.tmpdir() }).single('avatar'), editProfile);

module.exports = router;
