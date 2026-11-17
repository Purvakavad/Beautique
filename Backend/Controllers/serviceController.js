import mongoose from "mongoose";
import Service from "../models/Service.js";
export const addService = async (req, res) => {
    try {
        const {
            title,
            category,
            icon,
            shortDescription,
            description,
            duration,
            startingPrice,
            experience,
            benefits,
            status,
            featured,
            displayOrder,
        } = req.body;
        if (
            !title ||
            !category ||
            !shortDescription ||
            !description ||
            !duration ||
            startingPrice === undefined ||
            !experience ||
            !benefits
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }
        const parsedBenefits =
            typeof benefits === "string"
                ? JSON.parse(benefits)
                : benefits;
        if (
            !Array.isArray(parsedBenefits) ||
            parsedBenefits.length === 0 ||
            parsedBenefits.some(
                (item) => typeof item !== "string" || !item.trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Please add at least one valid benefit",
            });
        }
        const service = await Service.create({
            title,
            category,
            icon: icon || "Sparkles",
            shortDescription,
            description,
            duration,
            startingPrice: Number(startingPrice),
            experience,
            benefits: parsedBenefits,
            status: status === undefined ? true : status,
            featured: featured === undefined ? false : featured,
            displayOrder: Number(displayOrder) || 0,
        });
        return res.status(201).json({
            success: true,
            message: "Service added successfully",
            service,
        });
    } catch (error) {
        console.log("Add Service Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to add service",
        });
    }
};
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().sort({
            displayOrder: 1,
            createdAt: -1,
        });
        return res.status(200).json({
            success: true,
            message: "Services fetched successfully",
            total: services.length,
            services,
        });
    } catch (error) {
        console.log("Get All Services Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch services",
        });
    }
};
export const getActiveServices = async (req, res) => {
    try {
        const services = await Service.find({
            status: true,
        }).sort({
            displayOrder: 1,
            createdAt: -1,
        });
        return res.status(200).json({
            success: true,
            message: "Active services fetched successfully",
            total: services.length,
            services,
        });
    } catch (error) {
        console.log("Get Active Services Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch active services",
        });
    }
};
export const getSingleService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Service fetched successfully",
            service,
        });
    } catch (error) {
        console.log("Get Single Service Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch service",
        });
    }
};
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }
        const updatedData = { ...req.body };
        if (updatedData.benefits !== undefined) {
            updatedData.benefits =
                typeof updatedData.benefits === "string"
                    ? JSON.parse(updatedData.benefits)
                    : updatedData.benefits;
            if (
                !Array.isArray(updatedData.benefits) ||
                updatedData.benefits.length === 0 ||
                updatedData.benefits.some(
                    (item) => typeof item !== "string" || !item.trim()
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please add at least one valid benefit",
                });
            }
        }
        if (updatedData.startingPrice !== undefined) {
            updatedData.startingPrice = Number(updatedData.startingPrice);
        }
        if (updatedData.displayOrder !== undefined) {
            updatedData.displayOrder = Number(updatedData.displayOrder);
        }
        const service = await Service.findByIdAndUpdate(
            id,
            updatedData,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Service updated successfully",
            service,
        });
    } catch (error) {
        console.log("Update Service Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update service",
        });
    }
};
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }
        const service = await Service.findByIdAndDelete(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Service deleted successfully",
        });
    } catch (error) {
        console.log("Delete Service Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete service",
        });
    }
};
