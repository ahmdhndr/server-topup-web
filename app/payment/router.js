const express = require('express');

const router = express.Router();
const {
  index,
  createPaymentView,
  createPaymentHandler,
  editPaymentView,
  editPaymentHandler,
  deletePaymentHandler,
  updateStatusPaymentHandler,
} = require('./controller');

const { isLogin } = require('../../middleware/authMiddleware');

router.use(isLogin);
router.get('/', index);
router.get('/create', createPaymentView);
router.post('/create', createPaymentHandler);
router.get('/edit/:id', editPaymentView);
router.put('/edit/:id', editPaymentHandler);
router.delete('/delete/:id', deletePaymentHandler);
router.put('/status/:id', updateStatusPaymentHandler);

module.exports = router;
