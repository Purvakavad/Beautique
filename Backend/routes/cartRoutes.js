import express from "express";
import {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
} from "../Controllers/cartController.js";
import userAuth from "../middleware/userAuth.js";
const router = express.Router();
router.post("/add", userAuth, addToCart);
router.get("/get", userAuth, getCart);
router.put("/update", userAuth, updateCartQuantity);
router.delete("/remove/:productId", userAuth, removeFromCart);
export default router;
