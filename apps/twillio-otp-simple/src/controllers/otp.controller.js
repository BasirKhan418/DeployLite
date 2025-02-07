// src/controllers/otp.controller.js
const twilio = require('twilio');
const config = require('../config/twilio.config');

const client = twilio(config.accountSid, config.authToken);

const sendOTP = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        
        if (!phoneNumber || !otp) {
            return res.status(400).json({
                success: false,
                error: 'Phone number and OTP are required'
            });
        }

        const cleanPhone = phoneNumber.replace(/^\+/, '');

        const message = await client.messages.create({
            from: `whatsapp:${config.fromNumber}`,
            to: `whatsapp:+${cleanPhone}`,
            contentSid: config.templateSid,
            contentVariables: JSON.stringify({ "1": otp })
        });

        res.json({
            success: true,
            message: 'OTP sent successfully',
            messageId: message.sid,
            otp: otp
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = { sendOTP };