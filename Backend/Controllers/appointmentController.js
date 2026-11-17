import Appointment from "../Models/Appointment.js";
import mongoose from "mongoose";
export const createAppointment = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            service,
            date,
            time
        } = req.body;
        if (
            !name?.trim() ||
            !email?.trim() ||
            !phone?.trim() ||
            !service?.trim() ||
            !date ||
            !time
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all appointment fields"
            });
        }
        const appointmentDate = new Date(`${date}T00:00:00`);
        if (Number.isNaN(appointmentDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment date"
            });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (appointmentDate < today) {
            return res.status(400).json({
                success: false,
                message: "Please select today or a future date"
            });
        }
        const appointment = await Appointment.create({
            userId: req.userId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            service: service.trim(),
            date: appointmentDate,
            time
        });
        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            appointment
        });
    } catch (error) {
        console.log("CREATE APPOINTMENT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to book appointment",
            error: error.message
        });
    }
};
export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            userId: req.userId
        }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            total: appointments.length,
            appointments
        });
    } catch (error) {
        console.log("MY APPOINTMENTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch your appointments"
        });
    }
};
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            total: appointments.length,
            appointments
        });
    } catch (error) {
        console.log("GET APPOINTMENTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch appointments"
        });
    }
};
export const getSingleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment ID"
            });
        }
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }
        return res.status(200).json({
            success: true,
            appointment
        });
    } catch (error) {
        console.log("GET SINGLE APPOINTMENT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch appointment"
        });
    }
};
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment ID"
            });
        }
        const allowedStatuses = [
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled"
        ];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment status"
            });
        }
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Appointment status updated successfully",
            appointment
        });
    } catch (error) {
        console.log("UPDATE APPOINTMENT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update appointment"
        });
    }
};
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment ID"
            });
        }
        const appointment = await Appointment.findByIdAndDelete(id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Appointment deleted successfully"
        });
    } catch (error) {
        console.log("DELETE APPOINTMENT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete appointment"
        });
    }
};
