const express = require('express');

const router = express.Router();
const {
  signinView,
  loginUserHandler,
  logoutUserHandler,
} = require('./controller');

router.get('/', signinView);
router.post('/', loginUserHandler);
router.get('/logout', logoutUserHandler);

module.exports = router;
