import mongoose from "mongoose";
const paymentAttemptSchema = new mongoose.Schema(
    {
        gateway: {
            type: String,
            enum: ["RAZORPAY", "STRIPE"],
            default: "RAZORPAY"
        },
        razorpayOrderId: {
            type: String,
            default: null
        },
        razorpayPaymentId: {
            type: String,
            default: null
        },
        stripeSessionId: {
            type: String,
            default: null
        },
        stripePaymentIntentId: {
            type: String,
            default: null
        },
        status: {
            type: String,
            enum: ["PENDING", "FAILED", "SUCCESS"],
            default: "PENDING"
        },
        attemptedAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: true }
);
const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                image: {
                    type: String,
                    default: ""
                },
                price: {
                    type: Number,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],
        deliveryAddress: {
            fullName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true }
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "RAZORPAY", "STRIPE"],
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING"
        },
        orderStatus: {
            type: String,
            enum: [
                "PROCESSING",
                "CONFIRMED",
                "DELIVERED",
                "CANCELLED"
            ],
            default: "PROCESSING"
        },
        totalAmount: {
            type: Number,
            required: true
        },
        razorpayOrderId: {
            type: String,
            default: null
        },
        razorpayPaymentId: {
            type: String,
            default: null
        },
        stripeSessionId: {
            type: String,
            default: null
        },
        stripePaymentIntentId: {
            type: String,
            default: null
        },
        paymentAttempts: {
            type: [paymentAttemptSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);
const Order =
    mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;