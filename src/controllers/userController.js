const User = require('../models/userModel');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, mobile_no, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Default role to 'user' if not provided
    const userRole = role || 'user';

    // Optional: Validate mobile_no format
    const mobileRegex = /^[0-9]{10}$/;
    if (mobile_no && !mobileRegex.test(mobile_no)) {
      return res.status(400).json({ error: 'Invalid mobile number format' });
    }

    // Use the User model to create a user
    const user = await User.create({ username, email, password, mobile_no, role: userRole });

    res.status(201).json({
      id: user.id,
      username,
      email,
      mobile_no,
      role: userRole
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, mobile_no, role } = req.body;

  try {
    // Validate required fields
    if (!username && !email && !password && !mobile_no && !role) {
      return res.status(400).json({ error: 'At least one field should be updated' });
    }

    // Default role to 'user' if not provided
    const userRole = role || 'user';

    // Optional: Validate mobile_no format
    const mobileRegex = /^[0-9]{10}$/;
    if (mobile_no && !mobileRegex.test(mobile_no)) {
      return res.status(400).json({ error: 'Invalid mobile number format' });
    }

    // Use the User model to update the user
    const updatedUser = await User.update(id, { username, email, password, mobile_no, role: userRole });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      id,
      username,
      email,
      mobile_no,
      role: userRole
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.delete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
