const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const TruckOwner = require('../models/TruckOwner');
const Driver = require('../models/Driver');
const Company = require('../models/Company');

// GET /api/user/profile/:userId - Get user profile data
router.get('/profile/:userId', auth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// POST /api/user/profile/:userId - Update user profile
router.post('/profile/:userId', auth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedData = req.body;

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.isProfileUpdated = true;
        await user.save();

        res.status(200).json({"msg": "User profile updated successfully"});
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});


// Get profile data
router.get('/:userId', auth, async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        let profileData;
        switch (user.userType) {
            case 'Truck Owner':
                profileData = await TruckOwner.findOne({ user: userId });
                break;
            case 'Driver':
                profileData = await Driver.findOne({ user: userId });
                break;
            case 'Transportation Company':
                profileData = await Company.findOne({ user: userId });
                break;
            default:
                return res.status(400).json({ msg: 'Invalid user type' });
        }

        res.json({ user, profileData });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update profile data
router.post('/:userId/profile', auth, async (req, res) => {
    const userId = req.params.userId;
    const { userType, ...profileData } = req.body;

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        let data;
        switch (user.userType) {
            case 'Truck Owner':
                data = await TruckOwner.findOneAndUpdate({ user: userId }, profileData, { new: true, upsert: true });
                break;
            case 'Driver':
                data = await Driver.findOneAndUpdate({ user: userId }, profileData, { new: true, upsert: true });
                break;
            case 'Transportation Company':
                data = await Company.findOneAndUpdate({ user: userId }, profileData, { new: true, upsert: true });
                break;
            default:
                return res.status(400).json({ msg: 'Invalid user type' });
        }
        user.relatedTypeId = data._id
        await user.save()

        res.json({ msg: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
