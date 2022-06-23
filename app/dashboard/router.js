const express = require('express');

const router = express.Router();
const { index } = require('./controller');

const { isLogin } = require('../../middleware/authMiddleware');

router.use(isLogin);
router.get('/', index);

module.exports = router;
