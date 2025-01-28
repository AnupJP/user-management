const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');
const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');

// Load user data from JSON file
const usersDataPath = path.join(__dirname, '../seeder/json-data/users.json');
let usersData;

try {
  const fileContent = fs.readFileSync(usersDataPath, 'utf-8');
  usersData = JSON.parse(fileContent);
} catch (error) {
  console.error('Error reading users.json:', error.message);
  process.exit(1);
}

const createUsers = async () => {
  try {
    console.log('Database connection established successfully.');

    for (const userData of usersData) {
      const existingUser = await User.findOne({
        where: {
          email: userData.email
        }
      });

      if (existingUser) {
        console.log(`User with email ${userData.email} already exists.`);
        continue;
      }

      await User.create(userData);
      console.log(`User ${userData.username} created successfully!`);
    }

  } catch (error) {
    console.error('Error creating users:', error.message);
  } finally {
    process.exit();
  }
};

createUsers();
