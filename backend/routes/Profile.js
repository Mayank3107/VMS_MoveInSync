const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const cache = require('../utils/cache');

const Employee = require('../models/Employee');
const Visitor = require('../models/Visitor');
const Guard = require('../models/Guard');
const Admin = require('../models/Admin');

// Route to get user profile
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.data.id;
    const role = req.data.role;

    const cacheKey = `userProfile:${role}:${userId}`;
    const cachedUser = cache.get(cacheKey);

    if (cachedUser) {
      console.log('Serving user profile from cache');
      return res.json({ user: cachedUser });
    }

    let user;
    if (role === 'Visitor') {
      user = await Visitor.findById(userId);
    } else if (role === 'Employee') {
      user = await Employee.findById(userId);
    } else if (role === 'Guard') {
      user = await Guard.findById(userId);
    } else if (role === 'Admin') {
      user = await Admin.findById(userId);
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Cache the user profile for 2 minutes (120 seconds)
    cache.set(cacheKey, user, 6);

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Optional: A route to update the user profile, ensuring the cache is invalidated after the update
router.put('/update', authenticate, async (req, res) => {
  const { name, email, phoneNumber } = req.body;
  const userId = req.data.id;
  const role = req.data.role;

  try {
    let user;
    if (role === 'Visitor') {
      user = await Visitor.findById(userId);
    } else if (role === 'Employee') {
      user = await Employee.findById(userId);
    } else if (role === 'Guard') {
      user = await Guard.findById(userId);
    } else if (role === 'Admin') {
      user = await Admin.findById(userId);
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update the user profile fields
    user.Name = name || user.Name;
    user.Email = email || user.Email;
    user.PhoneNumber = phoneNumber || user.PhoneNumber;

    await user.save();

    // Invalidate the cached profile after update
    const cacheKey = `userProfile:${role}:${userId}`;
    cache.del(cacheKey);

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
