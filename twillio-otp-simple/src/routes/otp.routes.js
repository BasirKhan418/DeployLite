const express = require('express');
const otpController = require('../controllers/otp.controller');

const router = express.Router();

router.post('/send', otpController.sendOTP);

module.exports = router;