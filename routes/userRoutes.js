const express = require('express');
const router = express.Router();
const Validator = require('../utils/userValidators');

const userMiddleware = require('../middlewares/userMiddleware');
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers)
router.get('/:id', userMiddleware.validateUserId(Validator.userIdSchema), userController.getUserById)
router.delete('/:id', userMiddleware.validateUserId(Validator.userIdSchema), userController.deleteUserById)
router.put('/:id', userMiddleware.validateRegister(Validator.userSchema), userController.updateUserById)
router.post('/register', userMiddleware.validateRegister(Validator.userSchema), userController.UserRegister)
router.post('/login', userMiddleware.validateLogin(Validator.loginSchema), userController.UserLogin)

module.exports = router