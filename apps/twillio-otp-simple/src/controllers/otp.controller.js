const twilio = require('twilio');
const config = require('../config/twilio.config');

const client = twilio(config.accountSid, config.authToken);

class OTPController {
    async sendOTP(req, res) {
        try {
            const { phoneNumber } = req.body;

            if (!phoneNumber) {
                return res.status(400).json({
                    success: false,
                    error: 'Phone number is required'
                });
            }

            // Remove any existing '+' from phone number
            const cleanPhone = phoneNumber.replace(/^\+/, '');
            
            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Send WhatsApp message using template
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
                otp: otp // Returning OTP in response
            });
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new OTPController();
