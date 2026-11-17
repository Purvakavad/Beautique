import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                items: []
            });
        }
        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                productId,
                quantity: 1
            });
        }
        await cart.save();
        const updatedCart = await Cart.findOne({ userId })
            .populate("items.productId");
        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: updatedCart
        });
    } catch (error) {
        console.log("ADD TO CART ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId })
            .populate("items.productId");
        return res.status(200).json({
            success: true,
            cart: cart || { items: [] }
        });
    } catch (error) {
        console.log("GET CART ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        if (!productId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid product ID and quantity are required"
            });
        }
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }
        const item = cart.items.find(
            (item) => item.productId.toString() === productId
        );
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }
        item.quantity = quantity;
        await cart.save();
        const updatedCart = await Cart.findOne({ userId })
            .populate("items.productId");
        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: updatedCart
        });
    } catch (error) {
        console.log("UPDATE CART ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }
        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
        );
        await cart.save();
        const updatedCart = await Cart.findOne({ userId })
            .populate("items.productId");
        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: updatedCart
        });
    } catch (error) {
        console.log("REMOVE CART ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
