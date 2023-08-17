const express = require('express');
const router = express.Router();
const Validator = require('../utils/userValidators');

const userMiddleware = require('../middlewares/userMiddleware');
const userController = require('../controllers/userController');

router.get('/')
router.get('/:id')
router.delete('/:id')
router.put('/:id', userMiddleware.validateRegister(Validator.user))
router.post('/register', userMiddleware.validateRegister(Validator.user), userController.UserRegister)
router.post('/login', userMiddleware.validateLogin(Validator.login), authController.UserLogin)

module.exports = reouter