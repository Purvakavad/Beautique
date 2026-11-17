import { useState } from "react";
import axios from "axios";
import {
    FaArrowLeft,
    FaTags,
    FaImage,
    FaTimes,
    FaHeart,
    FaStar,
    FaGem,
    FaLeaf,
    FaMagic,
    FaPaintBrush,
    FaTag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AddCategory.css";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/categories/addCategory`;
const iconOptions = [
    { name: "FaHeart", label: "Heart", icon: FaHeart },
    { name: "FaStar", label: "Star", icon: FaStar },
    { name: "FaGem", label: "Gem", icon: FaGem },
    { name: "FaLeaf", label: "Leaf", icon: FaLeaf },
    { name: "FaMagic", label: "Magic", icon: FaMagic },
    { name: "FaPaintBrush", label: "Paint Brush", icon: FaPaintBrush },
    { name: "FaTag", label: "Tag", icon: FaTag },
];
const AddCategory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        name: "",
        shortDescription: "",
        description: "",
        icon: "FaStar",
        status: "true",
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB.");
            return;
        }
        setError("");
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };
    const removeImage = () => {
        if (preview) URL.revokeObjectURL(preview);
        setImage(null);
        setPreview("");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (
            !formData.title.trim() ||
            !formData.name.trim() ||
            !formData.shortDescription.trim() ||
            !formData.description.trim() ||
            !formData.icon
        ) {
            setError("Please fill all required fields.");
            return;
        }
        if (!image) {
            setError("Please select a category image.");
            return;
        }
        try {
            setSaving(true);
            const data = new FormData();
            data.append("title", formData.title.trim());
            data.append("name", formData.name.trim());
            data.append("shortDescription", formData.shortDescription.trim());
            data.append("description", formData.description.trim());
            data.append("icon", formData.icon);
            data.append("status", formData.status);
            data.append("image", image);
            await axios.post(API_URL, data, {
                withCredentials: true,
            });
            navigate("/categories", {
                state: {
                    message: "Category added successfully!",
                },
            });
        } catch (err) {
            console.error("Add Category Error:", err);
            setError(
                err.response?.data?.message || "Failed to add category."
            );
        } finally {
            setSaving(false);
        }
    };
    const SelectedIcon =
        iconOptions.find((item) => item.name === formData.icon)?.icon || FaStar;
    return (
        <main className="admin-category-page">
            {/* HEADER */}
            <div className="category-header">
                <div>
                    <p className="category-small-title">
                        BEAUTIQUE ADMIN PANEL
                    </p>
                    <h1>Add New Category</h1>
                    <p className="category-subtitle">
                        Create a new product category
                    </p>
                </div>
                <button
                    className="category-refresh-btn"
                    onClick={() => navigate("/categories")}
                    type="button"
                >
                    <FaArrowLeft /> Back to Categories
                </button>
            </div>
            {/* FORM CARD */}
            <div className="add-category-card">
                <div className="add-category-card-header">
                    <span>
                        <FaTags />
                    </span>
                    <div>
                        <h2>Category Information</h2>
                        <p>Enter all details of your new category</p>
                    </div>
                </div>
                <form className="category-form" onSubmit={handleSubmit}>
                    {/* TITLE */}
                    <div className="category-form-group">
                        <label htmlFor="categoryTitle">
                            Category Title <span>*</span>
                        </label>
                        <input
                            id="categoryTitle"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Perfume Collection"
                            required
                        />
                    </div>
                    {/* NAME */}
                    <div className="category-form-group">
                        <label htmlFor="categoryName">
                            Category Name <span>*</span>
                        </label>
                        <input
                            id="categoryName"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Perfume"
                            required
                        />
                    </div>
                    {/* SHORT DESCRIPTION */}
                    <div className="category-form-group">
                        <label htmlFor="categoryShortDescription">
                            Short Description <span>*</span>
                        </label>
                        <input
                            id="categoryShortDescription"
                            type="text"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            placeholder="e.g. Luxury Scents"
                            maxLength={60}
                            required
                        />
                        <small>
                            Short text for Gallery category cards.
                            {formData.shortDescription.length}/60
                        </small>
                    </div>
                    {/* FULL DESCRIPTION */}
                    <div className="category-form-group">
                        <label htmlFor="categoryDescription">
                            Full Description <span>*</span>
                        </label>
                        <textarea
                            id="categoryDescription"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter complete category description..."
                            rows="5"
                            required
                        />
                    </div>
                    {/* CATEGORY ICON */}
                    <div className="category-form-group">
                        <label htmlFor="categoryIcon">
                            Category Icon <span>*</span>
                        </label>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            marginBottom: "12px",
                        }}>
                            <div style={{
                                width: "55px",
                                height: "55px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "12px",
                                background: "#fff0f5",
                                color: "#e94b78",
                                fontSize: "24px",
                            }}>
                                <SelectedIcon />
                            </div>
                            <span>Selected Icon Preview</span>
                        </div>
                        <select
                            id="categoryIcon"
                            name="icon"
                            value={formData.icon}
                            onChange={handleChange}
                            required
                        >
                            {iconOptions.map((item) => (
                                <option
                                    key={item.name}
                                    value={item.name}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* CATEGORY IMAGE */}
                    <div className="category-form-group">
                        <label>
                            Category Image <span>*</span>
                        </label>
                        <div className="category-image-upload">
                            <input
                                id="categoryImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                            {!preview ? (
                                <label
                                    htmlFor="categoryImage"
                                    className="category-image-upload-box"
                                >
                                    <FaImage />
                                    <strong>Choose Category Image</strong>
                                    <span>PNG, JPG, WEBP (Max 5MB)</span>
                                </label>
                            ) : (
                                <div className="category-image-preview">
                                    <img
                                        src={preview}
                                        alt="Category preview"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        title="Remove image"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* STATUS */}
                    <div className="category-form-group">
                        <label htmlFor="categoryStatus">
                            Category Status
                        </label>
                        <select
                            id="categoryStatus"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                    {/* ERROR */}
                    {error && (
                        <div className="category-error-message">
                            {error}
                        </div>
                    )}
                    {/* BUTTONS */}
                    <div className="add-category-buttons">
                        <button
                            type="button"
                            className="category-cancel-btn"
                            onClick={() => navigate("/categories")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="category-save-btn"
                            disabled={saving}
                        >
                            {saving ? "Adding..." : "Add Category"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};
export default AddCategory;
