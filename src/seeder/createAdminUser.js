const User = require('../models/userModel');

const adminUser = {
    username: 'Admin',
    email: 'panchalanup2572@gmail.com',
    password: 'Admin@123',
    mobile_no: '9999999999',
    role: 'admin'
}

const createAdminUser = async () => {
    try {
        
         // Test the connection to the database
        //  await sequelize.authenticate();
         console.log('Database connection established successfully.');

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            where: {
                email: adminUser.email,
                role: adminUser.role
            }
        });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            return;
        }

        // Create admin user
         await User.create(adminUser);

        console.log('Admin user created successfully!');
        console.log(`Email: ${adminUser.email}`);
        console.log(`Password: ${adminUser.password}`);

    } catch (error) {
        console.error('Error creating admin user:', error.message);
    } finally {
        // Close the database connection
        process.exit();
    }
};

// Execute the function
createAdminUser();