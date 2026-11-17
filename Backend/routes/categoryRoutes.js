import express from "express";
import {
    addCategory,
    getCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
} from "../Controllers/categoryControlles.js";
import upload from "../middleware/upload.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();
router.get("/getCategories", getCategories);
router.post(
    "/addCategory",
    adminAuth,
    upload.single("image"),
    addCategory
);
router.get(
    "/getSingleCategory/:id",
    adminAuth,
    getSingleCategory
);
router.put(
    "/updateCategory/:id",
    adminAuth,
    upload.single("image"),
    updateCategory
);
router.delete(
    "/deleteCategory/:id",
    adminAuth,
    deleteCategory
);
export default router;
