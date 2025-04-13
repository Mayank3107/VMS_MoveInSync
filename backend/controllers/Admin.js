const bcrypt = require('bcrypt');
const Employee = require('../models/Employee');
const Guard = require('../models/Guard');
const cloudinary = require('../utils/cloudinary');
const Visit = require('../models/Visit');
const cache = require('../utils/cache');
const fs = require('fs');

// Controller to add new employee or guard
exports.Add = async (req, res) => {
  console.log(req.body);
  const { name, email, password, phoneNumber, department, role } = req.body;

  try {
    let model;
    // cache.del('all_users'); // Uncomment if you want to clear all users cache on adding a new user

    // Validate role
    switch (role) {
      case 'Employee':
        model = Employee;
        break;
      case 'Guard':
        model = Guard;
        break;
      default:
        return res.status(400).json({ message: 'Invalid role selected' });
    }

    // Check for existing user
    const existingUser = await model.findOne({ Email: email });
    if (existingUser) {
      return res.status(409).json({ message: `${role} already exists with this email` });
    }

    // Upload image to Cloudinary
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `${role}s`,
    });

    // Remove temp file
    fs.unlinkSync(req.file.path);
    cache.del('visit_history');  // Invalidate visit history cache

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (map fields to model's schema names)
    const newUserData = {
      Name: name,
      Email: email,
      PassWord: hashedPassword,
      Number: phoneNumber,
      Image: result.secure_url,
    };

    if (role === 'Employee') {
      newUserData.Department = department; // Only for Employee
    }

    // Create and save user in db
    const newUser = new model(newUserData);
    await newUser.save();

    // Response
    res.status(201).json({
      message: `${role} registered successfully`,
      userId: newUser._id,
      imageUrl: result.secure_url,
    });

  } catch (error) {
    // Error handling
    console.error('Add User Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all employee and guards detail for edit functionality
exports.users = async (req, res) => {
  const cacheKey = 'all_users';
  const cached = cache.get(cacheKey);

  // Check for cached data
  if (cached) return res.status(200).json({ users: cached, fromCache: true });

  // Fetch details
  try {
    const employees = await Employee.find();
    const guards = await Guard.find();

    const users = [...employees, ...guards].map(user => ({
      _id: user._id,
      Name: user.Name,
      Email: user.Email,
      role: user.__t || user.constructor.modelName,
      PhoneNumber: user.Number,
      Department: user.Department
    }));
    console.log(users);

    // Set cache and return response with 6-second expiration time
    cache.set(cacheKey, users, 6); // Cache for 6 seconds
    res.status(200).json({ users, fromCache: false });
  } catch (error) {
    // Error handling
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
};

// Get all visit history
exports.getAllVisitHistory = async (req, res) => {
  const cacheKey = 'visit_history';
  const cachedVisits = cache.get(cacheKey);

  // Check for cached data
  if (cachedVisits) {
    return res.status(200).json({ visits: cachedVisits, fromCache: true });
  }

  // Fetch visit details
  try {
    const visits = await Visit.find().sort({ createdAt: -1 });

    // Cache the visits with 6-second expiration time
    cache.set(cacheKey, visits, 6); // Cache for 6 seconds
    res.status(200).json({ visits, fromCache: false });
  } catch (err) {
    // Error handling
    console.error('Error fetching visit history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
