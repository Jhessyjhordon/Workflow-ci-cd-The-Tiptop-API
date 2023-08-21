const validateJackpotId = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.params);
  
        return next();
    } catch (err) {
        return res.status(400).json({ type: err.name, message: err.message });
    }
  };

const validateJackpot = (schema) => async (req, res, next) => {
    try {
      await schema.validate(req.body);

      return next();
    } catch (err) {
      return res.status(409).json({ type: err.name, message: err.message });
    }
};


  module.exports = { 
    validateJackpotId,validateJackpot
  } 