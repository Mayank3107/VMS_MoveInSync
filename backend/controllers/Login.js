const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cache = require('../utils/cache');  // Assuming cache utility is set up
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const Guard = require('../models/Guard');
const Visitor = require('../models/Visitor');

// Login handler
exports.Login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    let model;

    // Select correct model based on role
    switch (role) {
      case 'Admin':
        model = Admin;
        break;
      case 'Employee':
        model = Employee;
        break;
      case 'Visitor':
        model = Visitor;
        break;
      case 'Guard':
        model = Guard;
        break;
      default:
        return res.status(400).json({ message: 'Invalid role selected' });
    }

    // Check cache first
    const cacheKey = `${role}:${email}`;
    const cachedUser = cache.get(cacheKey);
    if (cachedUser) {
      // Return cached user info if found
      return res.status(200).json({
        message: `${role} login successful (cached)`,
        token: cachedUser.token,
        role,
        user: cachedUser.user,
      });
    }

    // Find user from the database
    user = await model.findOne({ Email: email });
    if (!user) return res.status(404).json({ message: `${role} not found` });
    
    // Compare password
    let isMatch;
    if (role === 'Admin') {
      isMatch = password === user.PassWord;
    } else {
      isMatch = await bcrypt.compare(password, user.PassWord); // Hashed match
    }
    
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    
    // Prepare user response
    const userResponse = {
      id: user._id,
      name: user.Name,
      email: user.Email,
    };
    
    // Cache the token and user info
    cache.set(cacheKey, {
      token,
      user: userResponse,
    }, 6); // Cache for 2 hours (same as token expiry)
    
    // console.log(user,role,password,isMatch);
    // Response
    res.status(200).json({
      message: `${role} login successful`,
      token,
      role,
      user: userResponse,
    });

  } catch (error) {
    // Error handling
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
