const express = require('express');

const router = express.Router();
const {
  index,
  createNominalView,
  createNominalHandler,
  editNominalView,
  editNominalHandler,
  deleteNominalHandler,
} = require('./controller');

const { isLogin } = require('../../middleware/authMiddleware');

router.use(isLogin);
router.get('/', index);
router.get('/create', createNominalView);
router.post('/create', createNominalHandler);
router.get('/edit/:id', editNominalView);
router.put('/edit/:id', editNominalHandler);
router.delete('/delete/:id', deleteNominalHandler);

module.exports = router;
