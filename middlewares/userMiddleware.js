require('dotenv').config();
var jwt = require('jsonwebtoken')

const validateRegister = (schema) => async (req, res, next) => {
    try {
      await schema.validate(req.body);

      return next();
    } catch (err) {
      return res.status(409).json({ type: err.name, message: err.message });
    }
};
const validateUserCreation = (schema) => async (req, res, next) => {
    try {
      await schema.validate(req.body);

      return next();
    } catch (err) {
      return res.status(409).json({ type: err.name, message: err.message });
    }
};

const validateLogin = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);

    return next();
  } catch (err) {
    return res.status(409).json({ type: err.name, message: err.message });
  }
};

const validateUserId = (schema) => async (req, res, next) => {
  try {
      await schema.validate(req.params);

      return next();
  } catch (err) {
      return res.status(400).json({ type: err.name, message: err.message });
  }
};

const checkIfUserIsEmployee = (req, res, next) => {
  const token = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
  // const user = req.user; // L'objet utilisateur décodé à partir du token
  if (token.role !== 'employee') {
      return res.status(403).json({
          error: true,
          message: 'Accès refusé : vous n\'êtes pas autorisé à effectuer cette action.'
      });
  }
  next();
};

const checkIfUserIsEmployeeOrAdmin = (req, res, next) => {
  const token = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
  // const user = req.user; // L'objet utilisateur décodé à partir du token
  if (token.role !== 'employee' && token.role !== 'admin') {
      return res.status(403).json({
          error: true,
          message: 'Accès refusé : vous n\'êtes pas autorisé à effectuer cette action.'
      });
  }
  next();
};

const checkIfUserToken = (req, res, next) => {
  const token = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
  if (!token) {
      return res.status(403).json({
          error: true,
          message: 'Accès refusé : vous n\'êtes pas autorisé à effectuer cette action.'
      });
  }
  next();
};


module.exports = { 
  validateRegister,
  validateLogin,
  validateUserId,
  checkIfUserIsEmployee,
  checkIfUserIsEmployeeOrAdmin,
  checkIfUserToken,
  validateUserCreation
} 