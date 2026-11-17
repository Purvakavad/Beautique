import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        icon: {
            type: String,
            default: "Sparkles",
            trim: true,
        },
        shortDescription: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        duration: {
            type: String,
            required: true,
            trim: true,
        },
        startingPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        experience: {
            type: String,
            required: true,
            trim: true,
        },
        benefits: {
            type: [String],
            required: true,
            validate: {
                validator: (items) =>
                    items.length > 0 && items.every((item) => item.trim()),
                message: "At least one benefit is required",
            },
        },
        status: {
            type: Boolean,
            default: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);
const Service = mongoose.model("Service", serviceSchema);
export default Service;
