// config/mailchimp.js
const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: 'us21'
});

module.exports = mailchimp;
