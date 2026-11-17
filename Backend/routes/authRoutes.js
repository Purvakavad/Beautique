import express from "express";
import {
    register,
    login,
    getProfile,
    logout,
    updateProfile,
    getAllUsers
} from "../controllers/authController.js";
import authAdmin from '../middleware/adminAuth.js'
import userAuth from "../middleware/userAuth.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", userAuth, getProfile);
router.post("/logout", userAuth, logout);
router.put("/update-profile", userAuth, updateProfile);
router.get("/getAllUsers", authAdmin, getAllUsers);
export default router;
