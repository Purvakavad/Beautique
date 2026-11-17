import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import stripe from "../config/stripe.js";
const isSameCheckout = (order, items, address, totalAmount) => {
    const sameAddress = Object.keys(address).every(
        (key) => order.deliveryAddress[key] === address[key]
    );
    const sameItems =
        order.items.length === items.length &&
        items.every((item) =>
            order.items.some(
                (oldItem) =>
                    oldItem.productId.toString() === item.productId.toString() &&
                    oldItem.quantity === item.quantity &&
                    oldItem.price === item.price
            )
        );
    return (
        sameAddress &&
        sameItems &&
        order.totalAmount === totalAmount
    );
};
export const createOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            fullName,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            paymentMethod
        } = req.body;
        if (
            !fullName ||
            !email ||
            !phone ||
            !address ||
            !city ||
            !state ||
            !pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all delivery address fields"
            });
        }
        if (paymentMethod !== "COD") {
            return res.status(400).json({
                success: false,
                message: "Please select Cash on Delivery"
            });
        }
        const cart = await Cart.findOne({ userId })
            .populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }
        let totalAmount = 0;
        const orderItems = [];
        for (const item of cart.items) {
            const product = item.productId;
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "A product in your cart is unavailable"
                });
            }
            const quantity = Number(item.quantity);
            const price = Number(product.price);
            if (
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                !Number.isFinite(price) ||
                price < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product quantity or price"
                });
            }
            const subtotal = price * quantity;
            totalAmount += subtotal;
            orderItems.push({
                productId: product._id,
                name: product.name,
                image: product.image || "",
                price,
                quantity
            });
        }
        const newOrder = await Order.create({
            userId,
            items: orderItems,
            deliveryAddress: {
                fullName,
                email,
                phone,
                address,
                city,
                state,
                pincode
            },
            paymentMethod: "COD",
            paymentStatus: "PENDING",
            orderStatus: "PROCESSING",
            totalAmount
        });
        await Cart.updateOne(
            { userId },
            { $set: { items: [] } }
        );
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: newOrder
        });
    } catch (error) {
        console.log("CREATE ORDER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to place order",
            error: error.message
        });
    }
};
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.userId
        }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.log("GET ORDERS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch orders"
        });
    }
};
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email phone")
            .sort({ createdAt: -1 });
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(
            (order) => order.orderStatus === "PENDING"
        ).length;
        const processingOrders = orders.filter(
            (order) => order.orderStatus === "PROCESSING"
        ).length;
        const deliveredOrders = orders.filter(
            (order) => order.orderStatus === "DELIVERED"
        ).length;
        const cancelledOrders = orders.filter(
            (order) => order.orderStatus === "CANCELLED"
        ).length;
        const paidOrders = orders.filter(
            (order) => order.paymentStatus === "PAID"
        ).length;
        return res.status(200).json({
            success: true,
            totalOrders,
            pendingOrders,
            processingOrders,
            deliveredOrders,
            cancelledOrders,
            paidOrders,
            orders,
        });
    } catch (error) {
        console.log("Get All Orders Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
};
export const getSingleOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }
        const order = await Order.findOne({
            _id: orderId,
            userId: req.userId
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.log("SINGLE ORDER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch order"
        });
    }
};
export const createRazorpayOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            fullName,
            email,
            phone,
            address,
            city,
            state,
            pincode
        } = req.body;
        if (
            !fullName || !email || !phone ||
            !address || !city || !state || !pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all delivery address fields"
            });
        }
        if (
            !process.env.RAZORPAY_KEY_ID ||
            !process.env.RAZORPAY_KEY_SECRET
        ) {
            return res.status(500).json({
                success: false,
                message: "Razorpay keys are missing"
            });
        }
        const cart = await Cart.findOne({ userId })
            .populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }
        let totalAmount = 0;
        const orderItems = [];
        for (const item of cart.items) {
            const product = item.productId;
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "Product unavailable"
                });
            }
            const quantity = Number(item.quantity);
            const price = Number(product.price);
            if (
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                !Number.isFinite(price) ||
                price < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product details"
                });
            }
            totalAmount += price * quantity;
            orderItems.push({
                productId: product._id,
                name: product.name,
                image: product.image || "",
                price,
                quantity
            });
        }
        if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order amount"
            });
        }
        const deliveryAddress = {
            fullName,
            email,
            phone,
            address,
            city,
            state,
            pincode
        };
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: `bb_${Date.now()}`
        });
        const existingOrders = await Order.find({
            userId,
            paymentMethod: "RAZORPAY",
            paymentStatus: { $in: ["PENDING", "FAILED"] },
            orderStatus: { $in: ["PROCESSING", "CANCELLED"] }
        }).sort({ createdAt: -1 });
        let order = existingOrders.find((oldOrder) =>
            isSameCheckout(
                oldOrder,
                orderItems,
                deliveryAddress,
                totalAmount
            )
        );
        if (order) {
            order.paymentStatus = "PENDING";
            order.orderStatus = "PROCESSING";
            order.razorpayOrderId = razorpayOrder.id;
            order.razorpayPaymentId = null;
            order.paymentAttempts.push({
                razorpayOrderId: razorpayOrder.id,
                status: "PENDING"
            });
            await order.save();
        } else {
            order = await Order.create({
                userId,
                items: orderItems,
                deliveryAddress,
                paymentMethod: "RAZORPAY",
                paymentStatus: "PENDING",
                orderStatus: "PROCESSING",
                totalAmount,
                razorpayOrderId: razorpayOrder.id,
                paymentAttempts: [
                    {
                        razorpayOrderId: razorpayOrder.id,
                        status: "PENDING"
                    }
                ]
            });
        }
        return res.status(201).json({
            success: true,
            message: "Razorpay order created",
            keyId: process.env.RAZORPAY_KEY_ID,
            razorpayOrder,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create Razorpay order"
        });
    }
};
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification details missing"
            });
        }
        const order = await Order.findOne({
            userId,
            paymentMethod: "RAZORPAY",
            "paymentAttempts.razorpayOrderId": razorpay_order_id
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");
        const expectedBuffer = Buffer.from(expectedSignature);
        const receivedBuffer = Buffer.from(razorpay_signature);
        const isAuthentic =
            expectedBuffer.length === receivedBuffer.length &&
            crypto.timingSafeEqual(
                expectedBuffer,
                receivedBuffer
            );
        if (!isAuthentic) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }
        const attempt = order.paymentAttempts.find(
            (item) => item.razorpayOrderId === razorpay_order_id
        );
        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Payment attempt not found"
            });
        }
        if (order.paymentStatus === "PAID") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified",
                order
            });
        }
        attempt.status = "SUCCESS";
        attempt.razorpayPaymentId = razorpay_payment_id;
        order.paymentStatus = "PAID";
        order.orderStatus = "CONFIRMED";
        order.razorpayOrderId = razorpay_order_id;
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();
        await Cart.updateOne(
            { userId },
            { $set: { items: [] } }
        );
        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order
        });
    } catch (error) {
        console.log("RAZORPAY VERIFY ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};
export const handleRazorpayFailure = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            razorpay_order_id,
            razorpay_payment_id
        } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id) {
            return res.status(400).json({
                success: false,
                message: "Payment failure details missing"
            });
        }
        const order = await Order.findOne({
            userId,
            paymentMethod: "RAZORPAY",
            "paymentAttempts.razorpayOrderId": razorpay_order_id
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        if (order.paymentStatus === "PAID") {
            return res.status(409).json({
                success: false,
                message: "This order is already paid"
            });
        }
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const payment = await razorpay.payments.fetch(
            razorpay_payment_id
        );
        if (payment.order_id !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Payment does not belong to this order"
            });
        }
        if (payment.status !== "failed") {
            return res.status(400).json({
                success: false,
                message: "Razorpay has not confirmed payment failure"
            });
        }
        const attempt = order.paymentAttempts.find(
            (item) => item.razorpayOrderId === razorpay_order_id
        );
        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Payment attempt not found"
            });
        }
        attempt.status = "FAILED";
        attempt.razorpayPaymentId = razorpay_payment_id;
        order.paymentStatus = "PENDING";
        order.orderStatus = "PROCESSING";
        await order.save();
        return res.status(200).json({
            success: true,
            message: "Payment attempt failed. You can retry payment.",
            order
        });
    } catch (error) {
        console.log("RAZORPAY FAILURE ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update payment failure"
        });
    }
};
export const createStripeCheckout = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            fullName,
            email,
            phone,
            address,
            city,
            state,
            pincode
        } = req.body;
        if (
            !fullName || !email || !phone ||
            !address || !city || !state || !pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all delivery address fields"
            });
        }
        if (!process.env.FRONTEND_URL) {
            return res.status(500).json({
                success: false,
                message: "Frontend URL is missing"
            });
        }
        const cart = await Cart.findOne({ userId })
            .populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }
        let totalAmount = 0;
        const orderItems = [];
        for (const item of cart.items) {
            const product = item.productId;
            const quantity = Number(item.quantity);
            const price = Number(product?.price);
            if (
                !product ||
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                !Number.isFinite(price) ||
                price <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product details"
                });
            }
            totalAmount += price * quantity;
            orderItems.push({
                productId: product._id,
                name: product.name,
                image: product.image || "",
                price,
                quantity
            });
        }
        const deliveryAddress = {
            fullName,
            email,
            phone,
            address,
            city,
            state,
            pincode
        };
        const existingOrders = await Order.find({
            userId,
            paymentMethod: "STRIPE",
            paymentStatus: { $in: ["PENDING", "FAILED"] },
            orderStatus: { $in: ["PROCESSING", "CANCELLED"] }
        }).sort({ createdAt: -1 });
        let order = existingOrders.find((oldOrder) =>
            isSameCheckout(
                oldOrder,
                orderItems,
                deliveryAddress,
                totalAmount
            )
        );
        if (!order) {
            order = await Order.create({
                userId,
                items: orderItems,
                deliveryAddress,
                paymentMethod: "STRIPE",
                paymentStatus: "PENDING",
                orderStatus: "PROCESSING",
                totalAmount
            });
        }
        const lineItems = orderItems.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));
        const frontendUrl = process.env.FRONTEND_URL.replace(/\/+$/, "");
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url:
                `${frontendUrl}/payment-success?order_id=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:
                `${frontendUrl}/checkout?payment=cancelled`,
            client_reference_id: order._id.toString(),
            metadata: {
                userId: userId.toString(),
                orderId: order._id.toString()
            }
        });
        order.stripeSessionId = session.id;
        order.paymentAttempts.push({
            gateway: "STRIPE",
            stripeSessionId: session.id,
            status: "PENDING"
        });
        await order.save();
        return res.status(201).json({
            success: true,
            message: "Stripe checkout created",
            url: session.url,
            sessionId: session.id,
            orderId: order._id
        });
    } catch (error) {
        console.log("STRIPE CHECKOUT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Stripe checkout failed"
        });
    }
};
export const verifyStripeSession = async (req, res) => {
    try {
        const userId = req.userId;
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required"
            });
        }
        const session = await stripe.checkout.sessions.retrieve(
            sessionId
        );
        if (session.metadata?.userId !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Invalid payment session"
            });
        }
        const orderId = session.metadata?.orderId;
        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID"
            });
        }
        const order = await Order.findOne({
            _id: orderId,
            userId,
            paymentMethod: "STRIPE"
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        if (
            session.status !== "complete" ||
            session.payment_status !== "paid"
        ) {
            return res.status(200).json({
                success: true,
                verified: false,
                message: "Payment is pending"
            });
        }
        if (
            session.currency !== "inr" ||
            session.amount_total !== Math.round(order.totalAmount * 100)
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment amount does not match"
            });
        }
        const attempt = order.paymentAttempts.find(
            (item) => item.stripeSessionId === session.id
        );
        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Payment attempt not found"
            });
        }
        if (order.paymentStatus !== "PAID") {
            const paymentIntentId =
                typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : session.payment_intent?.id || null;
            attempt.status = "SUCCESS";
            attempt.stripePaymentIntentId = paymentIntentId;
            order.stripeSessionId = session.id;
            order.stripePaymentIntentId = paymentIntentId;
            order.paymentStatus = "PAID";
            order.orderStatus = "CONFIRMED";
            await order.save();
        }
        await Cart.updateOne(
            { userId },
            { $set: { items: [] } }
        );
        return res.status(200).json({
            success: true,
            verified: true,
            message: "Payment verified successfully",
            order
        });
    } catch (error) {
        console.log("STRIPE VERIFY ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to verify payment"
        });
    }
};
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body;
        if (!orderId || !orderStatus) {
            return res.status(400).json({
                success: false,
                message: "Order ID and order status are required",
            });
        }
        const allowedStatuses = [
            "PROCESSING",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ];
        const newStatus = orderStatus.toUpperCase();
        if (!allowedStatuses.includes(newStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status",
            });
        }
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        order.orderStatus = newStatus;
        await order.save();
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message,
        });
    }
};
