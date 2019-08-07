const express = require('express');
const router = express.Router();
const User = require('../controller/user.controller');
// const auth = require('../auth/auth');

router.post('/registration', User.registration);
router.post('/login', User.login);
router.post('/logout', User.logout);

module.exports = router;