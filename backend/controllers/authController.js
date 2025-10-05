const User = require('../models/User');
const jwt = require('jsonwebtoken');

const getSignedToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};


exports.register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({ username, email, password });
        res.status(201).json({
            success: true,
            token: getSignedToken(user._id)
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid details' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid password!' });
        }
        
        res.status(200).json({
            success: true,
            token: getSignedToken(user._id),
            username: user.username
        });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error during login' });
    }
};