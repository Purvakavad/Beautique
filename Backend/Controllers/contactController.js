import Contact from "../models/Contact.js";
import mongoose from "mongoose";
export const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }
        const newContact = await Contact.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim()
        });
        return res.status(201).json({
            success: true,
            message: "Your message has been sent successfully!",
            contact: newContact
        });
    } catch (error) {
        console.log("CREATE CONTACT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to send your message."
        });
    }
};
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            total: contacts.length,
            contacts
        });
    } catch (error) {
        console.log("GET ALL CONTACTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch contact messages."
        });
    }
};
export const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact ID"
            });
        }
        const allowedStatuses = ["Unread", "Read", "Handled"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact status"
            });
        }
        const contact = await Contact.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Contact status updated successfully",
            contact
        });
    } catch (error) {
        console.log("UPDATE CONTACT STATUS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update contact status"
        });
    }
};
export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid contact ID"
            });
        }
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Contact message deleted successfully"
        });
    } catch (error) {
        console.log("DELETE CONTACT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete contact message"
        });
    }
};