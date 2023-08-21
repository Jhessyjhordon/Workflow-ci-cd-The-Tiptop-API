const validateShopId = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.params);
  
        return next();
    } catch (err) {
        return res.status(400).json({ type: err.name, message: err.message });
    }
  };

  const validateShop = (schema) => async (req, res, next) => {
    try {
      await schema.validate(req.body);

      return next();
    } catch (err) {
      return res.status(409).json({ type: err.name, message: err.message });
    }
};


  module.exports = { 
    validateShopId,validateShop
  } 