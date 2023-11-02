const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env; // Assurez-vous que la clé secrète est configurée dans votre environnement

function generateToken(user) {
  return jwt.sign(
    { email: user.email, id: user.id, role: user.role },
    JWT_SECRET_KEY
  );
}

function decodeToken(token) {
  return jwt.verify(token.replace('Bearer ', ''), JWT_SECRET_KEY);
}

module.exports = { generateToken, decodeToken };