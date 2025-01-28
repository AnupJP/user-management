const User = require('../models/userModel');
const sequelize = require('../config/db');
const { MESSAGES : responseMessages } = require('../constants/responseMessages');

// Create a new user
exports.createUser = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { username, email, password, mobile_no, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: responseMessages.MISSING_REQUIRED_FIELDS });
    }

    const userRole = role || 'user';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: responseMessages.INVALID_EMAIL_FORMAT });
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (mobile_no && !mobileRegex.test(mobile_no)) {
      return res.status(400).json({ error: responseMessages.INVALID_MOBILE_FORMAT });
    }

    const existingUser = await User.findOne({ where: { email }, transaction: t });
    if (existingUser) {
      return res.status(409).json({ error: responseMessages.EMAIL_ALREADY_EXISTS });
    }

    const user = await User.create({ username, email, password, mobile_no, role: userRole }, { transaction: t });

    // Commit the transaction after all operations are successful
    await t.commit();

    // Return the created user information (excluding the password)
    res.status(201).json({
      message: responseMessages.USER_CREATED_SUCCESSFULLY,
      user: {
        id: user.id,
        username,
        email,
        mobile_no,
        role: userRole
      }
    });
  } catch (error) {
    // Rollback the transaction if anything goes wrong
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: responseMessages.INTERNAL_SERVER_ERROR });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: responseMessages.NO_USERS_FOUND });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: responseMessages.INTERNAL_SERVER_ERROR });
  }
};


// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ error: responseMessages.INVALID_USER_ID });
    }

    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({ error: responseMessages.USER_NOT_FOUND });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: responseMessages.FAILED_TO_FETCH_USER });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, mobile_no, role } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: responseMessages.INVALID_USER_ID });
    }

    if (!username && !email && !password && !mobile_no && !role) {
      return res.status(400).json({ error: responseMessages.NO_FIELDS_TO_UPDATE });
    }

    // Default role to 'user' if not provided
    const userRole = role || 'user';

    const mobileRegex = /^[0-9]{10}$/;
    if (mobile_no && !mobileRegex.test(mobile_no)) {
      return res.status(400).json({ error: responseMessages.INVALID_MOBILE_FORMAT });
    }

    const updatedUser = await User.update(id, { username, email, password, mobile_no, role: userRole });

    if (!updatedUser) {
      return res.status(404).json({ error: responseMessages.USER_NOT_FOUND });
    }

    res.status(200).json({
      message: responseMessages.USER_UPDATED,
      id,
      username,
      email,
      mobile_no,
      role: userRole
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: responseMessages.FAILED_TO_UPDATE_USER });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ error: responseMessages.INVALID_USER_ID });
    }

    const deletedUser = await User.delete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: responseMessages.USER_NOT_FOUND });
    }

    res.status(200).json({ message: responseMessages.USER_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: responseMessages.FAILED_TO_DELETE_USER });
  }
};

