import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose"
export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "beautic/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
      rating,
      reviews,
      stock,
      badge,
      isFeatured
    } = req.body;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required."
      });
    }
    if (!name || !category || price === undefined || price === "") {
      return res.status(400).json({
        success: false,
        message: "Name, category and price are required",
      });
    }
    let imageUrl = "";
    let imagePublicId = "";
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }
    const product = await Product.create({
      name: String(name).trim(),
      category,
      price: Number(price),
      description: description ? String(description).trim() : "",
      image: imageUrl,
      imagePublicId: imagePublicId,
      rating: rating === undefined || rating === "" ? 0 : Number(rating),
      reviews: reviews === undefined || reviews === "" ? 0 : Number(reviews),
      stock: stock === undefined || stock === "" ? 0 : Number(stock),
      badge: badge ? String(badge).trim() : "",
      isFeatured: isFeatured === "true"
    });
    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(
      "Get Products Error:",
      error
    );
    res.status(500).json({
      success: false,
      message:
        "Failed to load products",
    });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const {
      name,
      category,
      price,
      description,
      rating,
      reviews,
      stock,
      badge,
      isFeatured
    } = req.body;
    let imageUrl = product.image;
    let imagePublicId = product.imagePublicId;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }
    product.name = name;
    product.category = category;
    product.price = price;
    product.description = description;
    product.rating = rating;
    product.reviews = reviews;
    product.stock = stock;
    product.badge = badge;
    product.isFeatured = isFeatured === "true";
    product.image = imageUrl;
    product.imagePublicId = imagePublicId;
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (product.imagePublicId) {
      const cloudinaryResult =
        await cloudinary.uploader.destroy(
          product.imagePublicId,
          { resource_type: "image" }
        );
      if (cloudinaryResult.result !== "ok" &&
        cloudinaryResult.result !== "not found") {
        return res.status(500).json({
          success: false,
          message: "Cloudinary image deletion failed",
        });
      }
    }
    await Product.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID"
      });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product
    });
  } catch (error) {
    console.log("Get Single Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message
    });
  }
};
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true
    })
      .sort({ createdAt: -1 })
      .limit(4);
    return res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.log("Featured Products Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
