const express = require('express');

const router = express.Router();
const {
  index,
  createCategoryView,
  createCategoryHandler,
  editCategoryView,
  editCategoryHandler,
  deleteCategoryHandler,
} = require('./controller');

const { isLogin } = require('../../middleware/authMiddleware');

router.use(isLogin);
router.get('/', index);
router.get('/create', createCategoryView);
router.post('/create', createCategoryHandler);
router.get('/edit/:id', editCategoryView);
router.put('/edit/:id', editCategoryHandler);
router.delete('/delete/:id', deleteCategoryHandler);

module.exports = router;
