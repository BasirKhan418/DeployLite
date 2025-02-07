require('dotenv').config();

const twilioConfig = {
    accountSid: process.env.accountSid,
    authToken: process.env.authToken,
    fromNumber: process.env.fromNumber,
    templateSid: process.env.templateSid,
};

module.exports = twilioConfig;