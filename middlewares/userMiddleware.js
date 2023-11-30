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
const validatePatchUser = (schema) => async (req, res, next) => {
  try {
    // Valider le corps de la requête (req.body)
    // await schema.validate(req.body);
    keys =  ['firstname', 'lastname', 'email', 'phone', 'address', 'birthDate', 'password' ];
    body = req.body

    if (Object.keys(body).length === 0) {
      throw new Error('Le corps de la requête (req.body) ne peut pas être vide.');
    }

    for (const key of keys) {
      if ( key in body && (body[key] === undefined || body[key] === null || body[key].trim() === '' )) {
        throw new Error(`Le'${key}' est vide dans le corps de la requete`);
      }
    }

    if ('email' in body && body.email !== req.user.email) {
      throw new Error('La modification de l\'email n\'est pas autorisée.');
    }


    // Valider les paramètres de la requête (req.params)
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

const checkIfUserIsAdmin = (req, res, next) => {
  const token = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
  // const user = req.user; // L'objet utilisateur décodé à partir du token
  if (token.role !== 'admin') {
      return res.status(403).json({
          error: true,
          message: "Accès refusé : vous n'êtes pas autorisé à effectuer cette action."
      });
  }
  next();
};

// const checkIfUserIsEmployeeOrAdmin = (req, res, next) => {
//   const token = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET_KEY);
//   // const user = req.user; // L'objet utilisateur décodé à partir du token
//   if (token.role !== 'employee' && token.role !== 'admin') {
//       return res.status(403).json({
//           error: true,
//           message: "Accès refusé : vous n'êtes pas autorisé à effectuer cette action."
//       });
//   }
//   next();
// };

const checkIfUserIsEmployeeOrAdmin = (req, res, next) => {
  const token = req.cookies.token; // Récupérer le token du cookie

  // Vérifiez si le token est présent
  if (!token) {
      return res.status(401).json({
          error: true,
          message: "Accès refusé : aucun token fourni."
      });
  }

  try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Vérifiez si l'utilisateur a le rôle requis
      if (decodedToken.role !== 'employee' && decodedToken.role !== 'admin') {
          return res.status(403).json({
              error: true,
              message: "Accès refusé : vous n'êtes pas autorisé à effectuer cette action."
          });
      }

      // Stockez les informations utilisateur décodées dans req pour une utilisation ultérieure
      req.user = decodedToken;

      next();
  } catch (error) {
      return res.status(403).json({
          error: true,
          message: "Token invalide ou expiré."
      });
  }
};


const checkIfUserToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      error: true,
      message: 'Accès non autorisé : Token manquant.'
    });
  }
  try {
    // Vérifier la validité du token et l'assigner à la variable token
    const token = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET_KEY);
    // Par exemple, pour stocker des informations de l'utilisateur dans req
    req.user = token; // ou une propriété spécifique du token   
    next();
  } catch (error) {
    return res.status(403).json({
      error: true,
      message: 'Accès refusé : Token invalide ou expiré.'
    });
  }
};


const checkIfUserTokenFromCookie = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      error: true,
      message: 'Accès non autorisé : Token manquant.'
    });
  }
  try {
    // Vérifier la validité du token et l'assigner à la variable decodedToken
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Stocker des informations de l'utilisateur dans req
    req.user = {
      id: decodedToken.id,
      role: decodedToken.role,
    } // ou une propriété spécifique du decodedToken
    next();
  } catch (error) {
    return res.status(403).json({
      error: true,
      message: 'Accès refusé : Token invalide ou expiré.'
    });
  }
};

const checkIfUserTokenFromCookiePresence = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      // Vérifier la validité du token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // Stocker des informations de l'utilisateur dans req
      req.user = {
        id: decodedToken.id,
        role: decodedToken.role,
      };
    } catch (error) {
      // Gestion des tokens invalides, mais ne pas arrêter la requête
      console.error('Token invalide:', error);
    }
  }
  // Continuer avec la requête, même si aucun token n'est trouvé ou si le token est invalide
  next();
};



module.exports = { 
  validateRegister,
  validateLogin,
  validateUserId,
  checkIfUserTokenFromCookie,
  checkIfUserTokenFromCookiePresence,
  checkIfUserIsEmployee,
  checkIfUserIsAdmin,
  checkIfUserIsEmployeeOrAdmin,
  checkIfUserToken,
  validateUserCreation,
  validatePatchUser
} 