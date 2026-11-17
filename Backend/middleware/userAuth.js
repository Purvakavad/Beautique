import jwt from "jsonwebtoken";
import User from "../models/User.js";
const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.userToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const user = await User.findById(decoded.userId)
            .select("tokenVersion");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        if (
            (user.tokenVersion || 0) !==
            (decoded.tokenVersion || 0)
        ) {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again."
            });
        }
        req.user = {
            id: user._id
        };
        req.userId = user._id;
        next();
    } catch (error) {
        console.log("AUTH MIDDLEWARE ERROR:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};
export default userAuth;
