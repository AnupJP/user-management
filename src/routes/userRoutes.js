const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware.verifyToken, authMiddleware.verifyRole('admin'), userController.createUser);
router.get('/', authMiddleware.verifyToken, userController.getUsers);
router.get('/:id', authMiddleware.verifyToken, userController.getUserById);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.verifyRole('admin'), userController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.verifyRole('admin'), userController.deleteUser);

module.exports = router;
