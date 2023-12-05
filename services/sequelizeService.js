// sequelizeService.js

const handleSequelizeError = (res, error, message) => {
    console.error(`Erreur de requête Sequelize : ${error}`);
    return res.status(500).json({
        error: true,
        message: [message]
    });
};

module.exports = { handleSequelizeError };
