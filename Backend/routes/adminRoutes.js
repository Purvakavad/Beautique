import express from "express";
import { adminLogin, adminLogout, checkAdminAuth } from "../Controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
const adminRouter = express.Router();
adminRouter.post("/login", adminLogin);
adminRouter.get("/profile", adminAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin profile fetched successfully",
    admin: req.admin,
  });
});
adminRouter.get("/checkAdminAuth", adminAuth, checkAdminAuth);
adminRouter.post("/logout", adminLogout);
export default adminRouter;
