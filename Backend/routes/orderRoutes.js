import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
    createOrder,
    getMyOrders,
    getSingleOrder,
    createRazorpayOrder,
    getAllOrders,
    verifyRazorpayPayment,
    handleRazorpayFailure,
    createStripeCheckout,
    verifyStripeSession,
    updateOrderStatus
} from "../Controllers/orderController.js";
import adminAuth from '../middleware/adminAuth.js'
const orderRouter = express.Router();
orderRouter.post(
    "/create",
    userAuth,
    createOrder
);
orderRouter.get(
    "/my-orders",
    userAuth,
    getMyOrders
);
orderRouter.get("/all", adminAuth, getAllOrders);
orderRouter.get(
    "/:orderId",
    adminAuth,
    getSingleOrder
);
orderRouter.post(
    "/razorpay/create",
    userAuth,
    createRazorpayOrder
);
orderRouter.post(
    "/razorpay/verify",
    userAuth,
    verifyRazorpayPayment
);
orderRouter.post(
    "/razorpay/failed",
    userAuth,
    handleRazorpayFailure
);
orderRouter.post(
    "/stripe/create",
    userAuth,
    createStripeCheckout
);
orderRouter.post(
    "/stripe/verify-session",
    userAuth,
    verifyStripeSession
);
orderRouter.put("/status", adminAuth, updateOrderStatus);
export default orderRouter;
