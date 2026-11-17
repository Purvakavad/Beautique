import express from "express";
import {
    createAppointment,
    getAllAppointments,
    getSingleAppointment,
    getMyAppointments,
    updateAppointmentStatus,
    deleteAppointment
} from "../Controllers/appointmentController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js"
const router = express.Router();
router.post("/", userAuth, createAppointment);
router.get("/my", userAuth, getMyAppointments);
router.get("/getAllAppointment", adminAuth, getAllAppointments);
router.get("/:id", adminAuth, getSingleAppointment);
router.put("/:id/status", adminAuth, updateAppointmentStatus);
router.delete("/deleteAppointment/:id", adminAuth, deleteAppointment);
export default router;