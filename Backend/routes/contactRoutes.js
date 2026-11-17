import express from "express";
import {
    createContact,
    getAllContacts,
    updateContactStatus,
    deleteContact
} from "../Controllers/contactController.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();
router.post("/", createContact);
router.get("/", adminAuth, getAllContacts);
router.put("/:id/status", adminAuth, updateContactStatus);
router.delete("/:id", adminAuth, deleteContact);
export default router;