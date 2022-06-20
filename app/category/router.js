const express = require('express');

const router = express.Router();
const { index, createCategoryView, createCategoryHandler } = require('./controller');

/* GET home page. */
router.get('/', index);
router.get('/create', createCategoryView);
router.post('/create', createCategoryHandler);

module.exports = router;
