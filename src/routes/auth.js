const express = require('express');
const router = express.Router();
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('config');
const crypto = require('crypto');
const auth = require('../middleware/auth');

// Email setup

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
});


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
};

// Forgot password - Send OTP to user's email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Generate OTP and save it to user document
        const otp = generateOTP();
        user.resetPasswordOTP = otp;
        console.log(otp);
        user.resetPasswordExpires = Date.now() + 3600000; // OTP expiration time (1 hour)
        await user.save();

        // Send email with OTP to user
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error sending OTP email');
            }
            console.log('Email sent: ' + info.response);
            res.json({ msg: 'OTP sent to your email. Check your inbox.' });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Verify OTP and reset password
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("hiiii");
            return res.status(404).json({ msg: 'User not found' });
        }

        if (otp !== user.resetPasswordOTP || Date.now() > user.resetPasswordExpires) {
            console.log("hi", otp, user.resetPasswordOTP);
            return res.status(400).json({ msg: 'Invalid OTP or OTP expired' });
        }

        // Reset password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordOTP = undefined; // Clear OTP and expiration
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ msg: 'Password reset successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



// Register user
router.post('/signup', async (req, res) => {
    const { fullName, email, password, userType } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            fullName,
            email,
            password,
            userType,
            confirmationToken: crypto.randomBytes(20).toString('hex')
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const confirmUrl = `${process.env.baseurl}/confirm/${user.confirmationToken}`;

        const mailOptions = {
            from: process.env.email,
            to: user.email,
            subject: 'Confirm your email',
            text: `Please confirm your email by clicking the following link: ${confirmUrl}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.send('Signup successful. Please check your email to confirm.');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Confirm email
router.get('/confirm/:token', async (req, res) => {
    try {
        const user = await User.findOne({ confirmationToken: req.params.token });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        user.isEmailConfirmed = true;
        user.confirmationToken = null;
        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.jwt,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, userId: user.id });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };
        let isProfileUpdated=user.isProfileUpdated
        let isProfiledataUpdated = user.relatedTypeId === null ? false : true
        let isVerified = user.isEmailConfirmed

        jwt.sign(
            payload,
            process.env.jwt,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, isProfileUpdated, isProfiledataUpdated, userId: user.id, isVerified });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;