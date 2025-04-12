require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');

const MONGO_URI = process.env.MONGO_URI;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB');

    const existing = await Admin.findOne({ Email: 'admin@example.com' });
    if (existing) {
      console.log('Admin already exists');
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new Admin({
      Name: 'Super Admin',
      Email: 'admin@example.com',
      PassWord: '1234',
      Number: '9999999999',
      Image: 'https://via.placeholder.com/150' // Replace with Cloudinary link if needed
    });

    await admin.save();
    console.log('Admin created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

seedAdmin();
