import Product from "../models/Product.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Contact from '../models/Contact.js'
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      registeredUsers,
      appointments,
      contactEnquiries,
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Appointment.countDocuments(),
      Contact.countDocuments(),
    ]);
    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      stats: {
        totalProducts,
        registeredUsers,
        appointments,
        contactEnquiries,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};
