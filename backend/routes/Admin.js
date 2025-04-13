const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/Admin');
const authenticate = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Employee = require('../models/Employee');
const Guard = require('../models/Guard');
const Visit=require('../models/Visit')
const cache = require('../utils/cache');

// Route to add a user
router.post('/add', authenticate, upload.single('Image'), AdminController.Add);

// Route to get all users (with cache applied)
router.get('/users', authenticate, async (req, res) => {
    const cachedUsers = cache.get('allUsers');  // Check cache first

    if (cachedUsers) {
        console.log('Serving from cache');
        return res.status(200).json({ users: cachedUsers });
    }

    try {
        // Fetch users from DB
        const employees = await Employee.find();
        const guards = await Guard.find();
        const allUsers = [...employees, ...guards];

        // Cache the data for 60 seconds
        cache.set('allUsers', allUsers, 60);

        res.status(200).json({ users: allUsers });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
});

// Route to update user information
router.put('/edit/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber, department } = req.body;

    try {
        let updatedUser = await Employee.findById(id);
        if (!updatedUser) updatedUser = await Guard.findById(id);
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        updatedUser.Name = name;
        updatedUser.Email = email;
        updatedUser.PhoneNumber = phoneNumber;
        updatedUser.Department = department;

        await updatedUser.save();

        // Invalidate the cache for users after update
        cache.del('allUsers');

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error });
    }
});

// Route to get all visit history (with cache applied)
router.get('/visits', authenticate, async (req, res) => {
    const cachedVisits = cache.get('allVisits');  // Check cache first

    if (cachedVisits) {
        console.log('Serving from cache');
        return res.status(200).json({ visits: cachedVisits });
    }

    try {
        // Fetch visits from DB
        const visits = await Visit.find().sort({ createdAt: -1 });

        // Cache the data for 60 seconds
        cache.set('allVisits', visits, 6);

        res.status(200).json({ visits });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch visit history', error });
    }
});

module.exports = router;
