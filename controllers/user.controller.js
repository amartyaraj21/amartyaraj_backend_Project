const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/ApiResponse');
const secrectkey = 'amartya'

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return ApiResponse(res, 400, 'User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();


        // Generate JWT token
        const token = generateAccessToken(newUser);

        ApiResponse(res, 201, 'User registered successfully', { name: newUser.name, token });
    } catch (error) {
        console.error('Error registering user:', error);
        ApiResponse(res, 500, 'Internal server error');
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return ApiResponse(res, 401, 'Invalid email or password');
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return ApiResponse(res, 401, 'Invalid email or password');
        }

        // Generate JWT token
        const token = generateAccessToken(user);

        ApiResponse(res, 200, 'Login successful', { name: user.name, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        ApiResponse(res, 500, 'Internal server error');
    }
};

// Helper function to generate JWT token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
        }, secrectkey,
        //process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1h',
            // process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

const updateUserSettings = async (req, res) => {
    try {
        const { newName, oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the provided old password matches the user's current password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return ApiResponse(res, 400, 'Old password is incorrect');
        }

        // Update the user's name if a new name is provided
        if (newName) {
            user.name = newName;
        }

        // Update the user's password if a new password is provided
        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Save the updated user object
        await user.save();

        return ApiResponse(res, 200, 'User settings updated successfully');
    } catch (error) {
        console.error('Error updating user settings:', error);
        return ApiResponse(res, 500, 'Internal server error');
    }
}

const fetchUserData = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming the user ID is stored in req.user._id after authentication
        const user = await User.findById(userId);

        if (!user) {
            return ApiResponse(res, 404, 'User not found');
        }

        // Return user data excluding sensitive information like password
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };

        ApiResponse(res, 200, 'User data retrieved successfully', userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        ApiResponse(res, 500, 'Internal server error');
    }
};



module.exports = { registerUser, loginUser, updateUserSettings, fetchUserData };

