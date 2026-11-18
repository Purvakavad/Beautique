import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaTimes, FaArrowLeft } from "react-icons/fa";
import "./AddService.css";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const initialForm = {
    title: "",
    category: "",
    icon: "FaMagic",
    shortDescription: "",
    description: "",
    duration: "",
    startingPrice: "",
    experience: "",
    benefits: [""],
    status: true,
    featured: false,
    displayOrder: 0,
};
const AddService = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleBenefitChange = (index, value) => {
        const updated = [...formData.benefits];
        updated[index] = value;
        setFormData((prev) => ({
            ...prev,
            benefits: updated,
        }));
    };
    const addBenefit = () => {
        setFormData((prev) => ({
            ...prev,
            benefits: [...prev.benefits, ""],
        }));
    };
    const removeBenefit = (index) => {
        setFormData((prev) => ({
            ...prev,
            benefits:
                prev.benefits.length === 1
                    ? [""]
                    : prev.benefits.filter((_, i) => i !== index),
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanedBenefits = formData.benefits
            .map((item) => item.trim())
            .filter(Boolean);
        if (cleanedBenefits.length === 0) {
            alert("Please add at least one benefit.");
            return;
        }
        try {
            setSubmitting(true);
            const payload = {
                ...formData,
                startingPrice: Number(formData.startingPrice),
                displayOrder: Number(formData.displayOrder),
                benefits: cleanedBenefits,
            };
            const response = await axios.post(
                `${API_URL}/api/services/add`,
                payload,
                { withCredentials: true }
            );
            if (response.data.success) {
                alert(response.data.message || "Service added successfully!");
                navigate("/services");
            }
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to add service. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="service-add-page">
            {/* HEADER */}
            <div className="service-add-header">
                <div>
                    <p>BEAUTIQUE MANAGEMENT</p>
                    <h1>Add New Service</h1>
                    <span>
                        Add a new beauty service to your website.
                    </span>
                </div>
                <button
                    type="button"
                    className="service-back-btn"
                    onClick={() => navigate("/services")}
                >
                    <FaArrowLeft />
                    Back to Services
                </button>
            </div>
            {/* FORM CARD */}
            <div className="service-add-card">
                <div className="service-add-card-heading">
                    <h2>Service Information</h2>
                    <p>Enter the details of your new service below.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="service-add-form-grid">
                        <div className="service-add-group">
                            <label>Service Title *</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Makeup Services"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="service-add-group">
                            <label>Category *</label>
                            <input
                                type="text"
                                name="category"
                                placeholder="e.g. Makeup"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="service-add-group">
                            <label>Choose Service Icon *</label>
                            <select
                                name="icon"
                                value={formData.icon}
                                onChange={handleChange}
                                required
                            >
                                <option value="FaMagic">Magic</option>
                                <option value="FaHeart">Heart</option>
                                <option value="FaCut">Hair Care</option>
                                <option value="FaGem">Gem</option>
                                <option value="FaStar">Star</option>
                                <option value="FaCrown">Crown</option>
                            </select>
                        </div>
                        <div className="service-add-group">
                            <label>Duration *</label>
                            <input
                                type="text"
                                name="duration"
                                placeholder="e.g. 45–60 Minutes"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="service-add-group">
                            <label>Starting Price (₹) *</label>
                            <input
                                type="number"
                                name="startingPrice"
                                placeholder="Enter price"
                                min="0"
                                value={formData.startingPrice}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="service-add-group">
                            <label>Experience *</label>
                            <input
                                type="text"
                                name="experience"
                                placeholder="e.g. Professional"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="service-add-group full">
                            <label>Short Description *</label>
                            <textarea
                                name="shortDescription"
                                placeholder="Enter short description"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                rows="2"
                                required
                            />
                        </div>
                        <div className="service-add-group full">
                            <label>Full Description *</label>
                            <textarea
                                name="description"
                                placeholder="Enter complete service description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                required
                            />
                        </div>
                        {/* BENEFITS */}
                        <div className="service-add-group full">
                            <div className="service-add-benefits-heading">
                                <label>What You Get / Benefits *</label>
                                <button
                                    type="button"
                                    onClick={addBenefit}
                                >
                                    <FaPlus /> Add Benefit
                                </button>
                            </div>
                            {formData.benefits.map((benefit, index) => (
                                <div
                                    className="service-add-benefit-row"
                                    key={index}
                                >
                                    <input
                                        type="text"
                                        placeholder={`Benefit ${index + 1}`}
                                        value={benefit}
                                        onChange={(e) =>
                                            handleBenefitChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeBenefit(index)}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="service-add-group">
                            <label>Display Order</label>
                            <input
                                type="number"
                                name="displayOrder"
                                min="0"
                                value={formData.displayOrder}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="service-add-checkboxes">
                            <label>
                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleChange}
                                />
                                Active Service
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                />
                                Featured Service
                            </label>
                        </div>
                    </div>
                    {/* FOOTER BUTTONS */}
                    <div className="service-add-footer">
                        <button
                            type="button"
                            className="service-add-cancel"
                            onClick={() => navigate("/services")}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="service-add-submit"
                            disabled={submitting}
                        >
                            <FaPlus />
                            {submitting ? "Saving..." : "Add Service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AddService;