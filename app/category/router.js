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

/* GET home page. */
router.get('/', index);
router.get('/create', createCategoryView);
router.post('/create', createCategoryHandler);
router.get('/edit/:id', editCategoryView);
router.put('/edit/:id', editCategoryHandler);
router.delete('/delete/:id', deleteCategoryHandler);

module.exports = router;
