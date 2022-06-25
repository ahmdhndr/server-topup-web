const express = require('express');

const router = express.Router();
const {
  index,
  updateStatusHandler,
} = require('./controller');

const { isLogin } = require('../../middleware/authMiddleware');

router.use(isLogin);
router.get('/', index);
router.put('/status/:id', updateStatusHandler);

module.exports = router;
