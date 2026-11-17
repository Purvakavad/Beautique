import jwt from "jsonwebtoken";
import Admin from "../Models/Admin.js";
const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.adminToken ||
      (authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only",
      });
    }
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.log("Admin Auth Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token",
    });
  }
};
export default adminAuth;
