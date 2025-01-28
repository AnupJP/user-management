const User = require('../models/userModel');
const sequelize = require('../config/db');
const { MESSAGES : responseMessages } = require('../constants/responseMessages');
const redis = require('../config/redis');

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

    await t.commit();

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

// Get all users with caching
exports.getUsers = async (req, res) => {
  try {
    const cacheKey = 'users';
    const cachedUsers = await redis.get(cacheKey);

    if (cachedUsers) {
      console.log("Returning cached Data.")
      return res.status(200).json(JSON.parse(cachedUsers));  // Return cached data
    }

    const users = await User.getAll();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: responseMessages.NO_USERS_FOUND });
    }

    // Cache the fetched users for 10 minutes (600 seconds)
    await redis.setex(cacheKey, 600, JSON.stringify(users));

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: responseMessages.INTERNAL_SERVER_ERROR });
  }
};

// Get user by ID with caching
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ error: responseMessages.INVALID_USER_ID });
    }

    // Check cache first
    const cacheKey = `user:${id}`;
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      return res.status(200).json(JSON.parse(cachedUser));  // Return cached data
    }

    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({ error: responseMessages.USER_NOT_FOUND });
    }

    await redis.setex(cacheKey, 600, JSON.stringify(user));

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

    if (!username && !email && !mobile_no && !role && password === undefined) {
      return res.status(400).json({ error: responseMessages.NO_FIELDS_TO_UPDATE });
    }

    // Default role to 'user' if not provided
    const userRole = role || 'user';

    const mobileRegex = /^[0-9]{10}$/;
    if (mobile_no && !mobileRegex.test(mobile_no)) {
      return res.status(400).json({ error: responseMessages.INVALID_MOBILE_FORMAT });
    }

    // Build the update object dynamically
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // only set password if provided
    if (mobile_no) updateData.mobile_no = mobile_no;
    updateData.role = userRole;

    const updatedUser = await User.update(id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: responseMessages.USER_NOT_FOUND });
    }

    // Invalidate cache
    await redis.del(`user:${id}`);
    await redis.del('users');

    res.status(200).json({
      message: responseMessages.USER_UPDATED,
      id,
      ...updateData
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

    // Invalidate cache
    await redis.del(`user:${id}`);
    await redis.del('users');

    res.status(200).json({ message: responseMessages.USER_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: responseMessages.FAILED_TO_DELETE_USER });
  }
};

