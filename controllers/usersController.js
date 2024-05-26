
const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt hashing

const createUser = async (req, res) => {
    console.log('Received request:', req.body);

    const { firstName, lastName, email, phone, userType, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !userType || !password) {
        console.error('Validation error:', req.body);
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
        console.error('Invalid email format:', email);
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phone.match(phoneRegex)) {
        console.error('Invalid phone format:', phone);
        return res.status(400).json({ message: 'Invalid phone format. It should be a 10-digit number.' });
    }

    try {
        // Check if user with the provided email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error('User already exists:', email);
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create and save new user with hashed password
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            userType,
            password: hashedPassword, // Store hashed password in the database
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const jwt = require('jsonwebtoken');
const { generateToken } = require('./auth');

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the email exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Return success response with JWT token and user data
        res.status(200).json({ success: true, token, user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



module.exports = { getUsers, createUser, getUser, updateUser, deleteUser, loginUser };
