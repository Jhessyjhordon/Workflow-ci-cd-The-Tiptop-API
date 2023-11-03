const cron = require('node-cron');
const { User } = require('../models/userModel');

const cleanExpiredLinks = cron.schedule('0 0 * * *', async () => {
    await User.update(
        {
            expiresAt: null,
            token: null
        },
        {
            where: { expiresAt: { $lt: new Date() } }
        }
    );
});

module.exports = { cleanExpiredLinks };
