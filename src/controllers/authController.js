const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Login a user and return a JWT token
exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log({ email, password })

  
      // Validate email and password
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      // Find the user by email
      const user = await User.findOne({
        where: {
            email
        }
    });
      console.log("USer :: ", JSON.stringify(user))
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Compare the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },  // You can add more claims like email, username, etc.
        process.env.JWT_SECRET,            // Store JWT_SECRET in environment variables
        { expiresIn: '1h' }               // Set token expiration time as per your requirement
      );
  
      res.status(200).json({
        message: 'Login successful',
        token: token
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to login' });
    }
  };