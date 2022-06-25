const express = require('express');
const multer = require('multer');
const os = require('os');

const router = express.Router();
const {
  signup,
  signin,
} = require('./controller');

router.post('/signup', multer({ dest: os.tmpdir() }).single('avatar'), signup);
router.post('/signin', signin);

module.exports = router;
