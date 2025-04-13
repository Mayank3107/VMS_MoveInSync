const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const cache = require('../utils/cache');

const Employee = require('../models/Employee');
const Visitor = require('../models/Visitor');
const Guard = require('../models/Guard');
const Admin = require('../models/Admin');

// Clean response by removing sensitive fields
const sanitizeUser = (user, role) => {
  const base = {
    _id: user._id,
    Name: user.Name,
    Email: user.Email,
    Image: user.Image,
    role,
  };

  if (role === 'Visitor') {
    return {
      ...base,
      Number: user.Number || null,
      Company: user.Company || '',
    };
  }

  if (role === 'Employee') {
    return {
      ...base,
      Number: user.Number || null,
      Department: user.Department || '',
    };
  }

  if (role === 'Guard') {
    return {
      ...base,
      Number: user.Number || null,
    };
  }

  return base; // For Admin or fallback
};

// Get profile
router.get('/', authenticate, async (req, res) => {
  // console.log(req.body);
  try {
    const { id: userId, role } = req.data;
    
    const cacheKey = `userProfile:${role}:${userId}`;
    const cachedUser = cache.get(cacheKey);
    
    if (cachedUser) {
      console.log('Serving user profile from cache');
      return res.json({ user: cachedUser });
    }
    
    let user;
    switch (role) {
      case 'Visitor':
        user = await Visitor.findById(userId);
        break;
        case 'Employee':
          user = await Employee.findById(userId);
          break;
          case 'Guard':
            user = await Guard.findById(userId);
            break;
            case 'Admin':
              user = await Admin.findById(userId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    const sanitized = sanitizeUser(user, role);
    cache.set(cacheKey, sanitized, 12); // cache for 2 minutes

    res.json({ user: sanitized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/update', authenticate, async (req, res) => {
  const { name, email, number, company, department } = req.body;
  const { id: userId, role } = req.data;
  
  try {
    let user;
    switch (role) {
      case 'Visitor':
        user = await Visitor.findById(userId);
        if (user) {
          user.Name = name || user.Name;
          user.Email = email || user.Email;
          user.Number = number || user.Number;
          user.Company = company || user.Company;
        }
        break;
        case 'Employee':
          user = await Employee.findById(userId);
          if (user) {
            user.Name = name || user.Name;
            user.Email = email || user.Email;
            user.Number = number || user.Number;
            user.DepartMent = department || user.Department;
        }
        break;
        case 'Guard':
          user = await Guard.findById(userId);
          if (user) {
            user.Name = name || user.Name;
            user.Email = email || user.Email;
            user.Number = number || user.Number;
          }
          break;
          case 'Admin':
            user = await Admin.findById(userId);
            if (user) {
              user.Name = name || user.Name;
              user.Email = email || user.Email;
            }
            break;
            default:
              return res.status(400).json({ message: 'Invalid role' });
    }
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.save();

    cache.del(`userProfile:${role}:${userId}`);
    
    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
