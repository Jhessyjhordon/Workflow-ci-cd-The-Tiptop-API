const crypto = require('crypto');

function generateConfirmationToken() {
    const token = crypto.randomBytes(20).toString('hex');
    return token;
}

module.exports = { generateConfirmationToken };