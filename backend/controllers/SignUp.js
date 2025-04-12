const bcrypt = require('bcrypt');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const cache = require('../utils/cache');  // Assuming cache utility is set up

const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const Guard = require('../models/Guard');
const Visitor = require('../models/Visitor');

// Employee signup handling
exports.EmployeeSignUp = async (req, res) => {
  const { Name, Email, PassWord, Number, DepartMent } = req.body.formData;
  
  try {
    // Check cache for existing user
    const cacheKey = `Employee:${Email}`;
    const cachedEmployee = cache.get(cacheKey);
    if (cachedEmployee) {
      return res.status(400).json({ message: 'Employee already exists (cached response)' });
    }

    // Check if employee already exists in DB
    const existing = await Employee.findOne({ Email });
    if (existing) {
      // Cache the result for 1 hour (3600 seconds)
      cache.set(cacheKey, true, 6);
      return res.status(400).json({ message: 'Employee already exists' });
    }

    // Hash password
    const hashedPassWord = await bcrypt.hash(PassWord, 10);
    let imageUrl = '';
    
    // Upload image if exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'Employee_images' });
      imageUrl = result.secure_url;
    }

    // Create and save new employee
    const employee = new Employee({ Name, Email, Number, PassWord: hashedPassWord, DepartMent, Image: imageUrl });
    await employee.save();

    // Return success response
    res.status(201).json({ message: 'Employee registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Guard signup handling
exports.GuardSignUp = async (req, res) => {
  const { Name, Email, PassWord, Number } = req.body;

  try {
    // Check cache for existing user
    const cacheKey = `Guard:${Email}`;
    const cachedGuard = cache.get(cacheKey);
    if (cachedGuard) {
      return res.status(400).json({ message: 'Guard already exists (cached response)' });
    }

    // Check if guard already exists in DB
    const existing = await Guard.findOne({ Email });
    if (existing) {
      // Cache the result for 1 hour (3600 seconds)
      cache.set(cacheKey, true, 6);
      return res.status(400).json({ message: 'Guard already exists' });
    }

    // Hash password
    const hashedPassWord = await bcrypt.hash(PassWord, 10);
    let imageUrl = '';
    
    // Upload image if exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'Guard_images' });
      imageUrl = result.secure_url;
    }

    // Create and save new guard
    const guard = new Guard({ Name, Email, Number, PassWord: hashedPassWord, Image: imageUrl });
    await guard.save();

    // Return success response
    res.status(201).json({ message: 'Guard registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Visitor signup handling
exports.VisitorSignUp = async (req, res) => {
  const { Name, Email, PassWord, Number } = req.body;

  try {
    // Check cache for existing user
    const cacheKey = `Visitor:${Email}`;
    const cachedVisitor = cache.get(cacheKey);
    if (cachedVisitor) {
      return res.status(400).json({ message: 'Visitor already exists (cached response)' });
    }

    // Check if visitor already exists in DB
    const existing = await Visitor.findOne({ Email });
    if (existing) {
      // Cache the result for 1 hour (3600 seconds)
      cache.set(cacheKey, true, 6);
      return res.status(400).json({ message: 'Visitor already exists' });
    }

    // Hash password
    const hashedPassWord = await bcrypt.hash(PassWord, 10);
    let imageUrl = '';
    
    // Upload image if exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'Visitor_images' });
      imageUrl = result.secure_url;
    }

    // Create and save new visitor
    const visitor = new Visitor({ Name, Email, Number, PassWord: hashedPassWord, Image: imageUrl });
    await visitor.save();

    // Return success response
    res.status(201).json({ message: 'Visitor registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
