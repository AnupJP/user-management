const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createUserSchema, updateUserSchema, userIdSchema } = require('../validations/userValidation');

const router = express.Router();

router.post('/',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('admin'),
    validateRequest(createUserSchema),
    userController.createUser
);

router.get('/',
    authMiddleware.verifyToken,
    userController.getUsers
);

router.get('/:id',
    authMiddleware.verifyToken,
    validateRequest(userIdSchema, 'params'),
    userController.getUserById
);

router.put('/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('admin'),
    validateRequest(updateUserSchema),
    userController.updateUser
);

router.delete('/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyRole('admin'),
    validateRequest(userIdSchema, 'params'),
    userController.deleteUser
);

module.exports = router;
