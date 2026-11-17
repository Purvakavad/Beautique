import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
export const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({
            email: normalizedEmail
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            name,
            email: normalizedEmail,
            phone,
            password: hashedPassword
        });
        console.log("user created by register")
        console.log("User Created Successfully:", user._id);
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.log("REGISTER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });
        console.log("Login User Found:", !!user);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
        console.log("Password Match:", isMatch);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            {
                userId: user._id,
                tokenVersion: user.tokenVersion || 0
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });
        await User.findByIdAndUpdate(user._id, {
            $set: {
                isOnline: true,
                lastLogin: new Date()
            }
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.log("LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("profile user id0", userId)
        const user = await User.findById(userId)
            .select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.userId, {
            $inc: {
                tokenVersion: 1
            },
            $set: {
                isOnline: false,
                lastLogout: new Date()
            }
        });
        res.clearCookie("userToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.log("Logout Error:", error);
        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const userId = req.user.id;
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }
        const user = await User.findByIdAndUpdate(
            userId,
            {
                name: name.trim(),
                phone
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password -tokenVersion")
            .sort({ createdAt: -1 });
        const customerIds = await Order.distinct("userId");
        return res.status(200).json({
            success: true,
            totalUsers: users.length,
            totalCustomers: customerIds.length,
            users,
        });
    } catch (error) {
        console.log("Get All Users Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};
