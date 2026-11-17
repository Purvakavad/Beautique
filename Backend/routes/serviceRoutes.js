import express from "express";
import {
    addService,
    getAllServices,
    getActiveServices,
    getSingleService,
    updateService,
    deleteService,
} from "../Controllers/serviceController.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();
router.get("/active", getActiveServices);
router.post("/add", adminAuth, addService);
router.get("/all", adminAuth, getAllServices);
router.get("/single/:id", adminAuth, getSingleService);
router.put("/update/:id", adminAuth, updateService);
router.delete("/delete/:id", adminAuth, deleteService);
export default router;
