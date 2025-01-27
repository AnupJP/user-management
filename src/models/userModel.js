const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [8, 100],
    },
  },
  mobile_no: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[0-9]{10}$/,
    },
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
}, {
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Static Methods to match controller operations
User.getAll = async function() {
  return await this.findAll({
    attributes: { exclude: ['password'] } // Don't send passwords
  });
};

User.getById = async function(id) {
  return await this.findByPk(id, {
    attributes: { exclude: ['password'] }
  });
};

User.update = async function(id, updates) {
  const user = await this.findByPk(id);
  
  if (!user) {
    return null;
  }

  // Update only provided fields
  if (updates.username) user.username = updates.username;
  if (updates.email) user.email = updates.email;
  if (updates.password) user.password = updates.password;
  if (updates.mobile_no) user.mobile_no = updates.mobile_no;
  if (updates.role) user.role = updates.role;

  await user.save();
  
  // Return user without password
  const updatedUser = user.toJSON();
  delete updatedUser.password;
  return updatedUser;
};

User.delete = async function(id) {
  const user = await this.findByPk(id);
  
  if (!user) {
    return null;
  }

  await user.destroy();
  return true;
};

// Instance method for password validation
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Additional helper methods
User.findByEmail = async function(email) {
  return await this.findOne({
    where: { email },
    attributes: { exclude: ['password'] }
  });
};

// Sync the model with the database
User.sync()
  .then(() => console.log('User model synced successfully'))
  .catch((err) => console.error('Error syncing User model:', err));

module.exports = User;