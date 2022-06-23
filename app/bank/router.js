const express = require('express');

const router = express.Router();
const {
  index,
  createBankView,
  createBankHandler,
  editBankView,
  editBankHandler,
  deleteBankHandler,
} = require('./controller');

const { isLogin } = require('../../middleware/authMiddleware');

router.use(isLogin);
router.get('/', index);
router.get('/create', createBankView);
router.post('/create', createBankHandler);
router.get('/edit/:id', editBankView);
router.put('/edit/:id', editBankHandler);
router.delete('/delete/:id', deleteBankHandler);

module.exports = router;
