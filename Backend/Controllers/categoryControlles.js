import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
export const addCategory = async (req, res) => {
    let uploadedImage;
    try {
        const {
            title,
            name,
            shortDescription,
            description,
            icon,
            status
        } = req.body;
        if (!title?.trim() || !name?.trim() || !description?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload category image.",
            });
        }
        if (
            !title?.trim() ||
            !name?.trim() ||
            !shortDescription?.trim() ||
            !description?.trim() ||
            !icon?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }
        const existingCategory = await Category.findOne({
            name: name.trim(),
        });
        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists.",
            });
        }
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "Beautique/Categories",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.end(req.file.buffer);
        });
        uploadedImage = uploadResult;
        const category = await Category.create({
            title: title.trim(),
            name: name.trim(),
            shortDescription: shortDescription.trim(),
            description: description.trim(),
            icon: icon.trim(),
            image: uploadResult.secure_url,
            imagePublicId: uploadResult.public_id,
            status: status === "false" ? false : true,
        });
        return res.status(201).json({
            success: true,
            message: "Category added successfully.",
            category,
        });
    } catch (error) {
        console.log("Add Category Error:", error);
        if (uploadedImage?.public_id) {
            try {
                await cloudinary.uploader.destroy(uploadedImage.public_id);
            } catch (deleteError) {
                console.log("Cloudinary Cleanup Error:", deleteError);
            }
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to add category.",
        });
    }
};
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({
            createdAt: -1,
        });
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const productCount = await Product.countDocuments({
                    category: category.name,
                });
                return {
                    ...category.toObject(),
                    productCount,
                };
            })
        );
        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully.",
            categories: categoriesWithCount,
        });
    } catch (error) {
        console.log("Get Categories Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories.",
            error: error.message,
        });
    }
};
const uploadCategoryImage = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "Beautique/Categories",
                resource_type: "image",
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(file.buffer);
    });
};
export const getSingleCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }
        const productCount = await Product.countDocuments({
            category: category.name,
        });
        return res.status(200).json({
            success: true,
            category: {
                ...category.toObject(),
                productCount,
            },
        });
    } catch (error) {
        console.log("Get Single Category Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch category.",
        });
    }
};
export const updateCategory = async (req, res) => {
    let newUploadedImage = null;
    try {
        const {
            title,
            name,
            shortDescription,
            description,
            icon,
            status
        } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }
        if (!title?.trim() || !name?.trim() || !description?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }
        if (
            !title?.trim() ||
            !name?.trim() ||
            !shortDescription?.trim() ||
            !description?.trim() ||
            !icon?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }
        const duplicate = await Category.findOne({
            name: name.trim(),
            _id: { $ne: category._id },
        });
        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "Category name already exists.",
            });
        }
        const oldName = category.name;
        const oldImagePublicId = category.imagePublicId;
        if (req.file) {
            newUploadedImage = await uploadCategoryImage(req.file);
            category.image = newUploadedImage.secure_url;
            category.imagePublicId = newUploadedImage.public_id;
        }
        category.title = title.trim();
        category.name = name.trim();
        category.shortDescription = shortDescription.trim();
        category.description = description.trim();
        category.icon = icon.trim();
        category.status = status === "false" ? false : true;
        await category.save();
        if (oldName !== category.name) {
            await Product.updateMany(
                { category: oldName },
                { $set: { category: category.name } }
            );
        }
        if (req.file && oldImagePublicId) {
            try {
                await cloudinary.uploader.destroy(oldImagePublicId);
            } catch (cloudinaryError) {
                console.log("Old Category Image Delete Error:", cloudinaryError);
            }
        }
        const productCount = await Product.countDocuments({
            category: category.name,
        });
        return res.status(200).json({
            success: true,
            message: "Category updated successfully.",
            category: {
                ...category.toObject(),
                productCount,
            },
        });
    } catch (error) {
        console.log("Update Category Error:", error);
        if (newUploadedImage?.public_id) {
            try {
                await cloudinary.uploader.destroy(newUploadedImage.public_id);
            } catch (cleanupError) {
                console.log("New Image Cleanup Error:", cleanupError);
            }
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update category.",
        });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }
        const productCount = await Product.countDocuments({
            category: category.name,
        });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `This category has ${productCount} products. Move or remove those products before deleting this category.`,
            });
        }
        const imagePublicId = category.imagePublicId;
        await Category.findByIdAndDelete(req.params.id);
        if (imagePublicId) {
            try {
                await cloudinary.uploader.destroy(imagePublicId);
            } catch (cloudinaryError) {
                console.log("Category Image Delete Error:", cloudinaryError);
            }
        }
        return res.status(200).json({
            success: true,
            message: "Category and its image deleted successfully.",
        });
    } catch (error) {
        console.log("Delete Category Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete category.",
        });
    }
};
