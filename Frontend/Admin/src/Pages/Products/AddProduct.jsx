import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    FaArrowLeft,
    FaPlus,
    FaTimes,
} from "react-icons/fa";
import axios from "axios";
import "./AddProduct.css";
const initialForm = {
    name: "",
    category: "",
    price: "",
    rating: "",
    reviews: "",
    stock: "",
    badge: "",
    description: "",
};
const API_URL = import.meta.env.VITE_BACKEND_URL;
const AddProduct = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            setCategoryError("");
            const response = await axios.get(
                `${API_URL}/api/categories/getCategories`,
                {
                    withCredentials: true,
                }
            );
            if (response.data.success) {
                const activeCategories = response.data.categories.filter(
                    (category) => category.status === true
                );
                setCategories(activeCategories);
                setForm((prev) => ({
                    ...prev,
                    category: activeCategories.some(
                        (category) => category.name === prev.category
                    )
                        ? prev.category
                        : activeCategories[0]?.name || "",
                }));
            } else {
                setCategoryError("Categories could not be loaded.");
            }
        } catch (err) {
            console.error("Fetch Categories Error:", err);
            setCategoryError(
                err.response?.data?.message ||
                "Unable to load categories."
            );
        } finally {
            setLoadingCategories(false);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image.");
            e.target.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            e.target.value = "";
            return;
        }
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setError("");
    };
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.name.trim()) {
            setError("Please enter product name.");
            return;
        }
        if (!form.category) {
            setError("Please select a category.");
            return;
        }
        if (form.price === "" || Number(form.price) < 0) {
            setError("Please enter a valid price.");
            return;
        }
        if (
            form.rating !== "" &&
            (Number(form.rating) < 0 || Number(form.rating) > 5)
        ) {
            setError("Rating must be between 0 and 5.");
            return;
        }
        if (!image) {
            setError("Please upload product image.");
            return;
        }
        const productData = new FormData();
        productData.append("name", form.name.trim());
        productData.append("category", form.category);
        productData.append("price", Number(form.price));
        productData.append("rating", Number(form.rating || 0));
        productData.append("reviews", Number(form.reviews || 0));
        productData.append("stock", Number(form.stock || 0));
        productData.append("badge", form.badge.trim());
        productData.append("description", form.description.trim());
        productData.append("isFeatured", isFeatured);
        productData.append("image", image);
        try {
            setSaving(true);
            const response = await axios.post(
                `${API_URL}/api/Product/addProduct`,
                productData,
                {
                    withCredentials: true,
                }
            );
            if (response.data.success === true) {
                alert("Product added successfully!");
                setForm(initialForm);
                setImage(null);
                setPreview("");
                setIsFeatured(false);
                navigate("/products");
            } else {
                setError(
                    response.data.message ||
                    "Product could not be added."
                );
            }
        } catch (err) {
            console.error("Add Product Error:", err);
            console.log("Backend Error:", err.response?.data);
            setError(
                err.response?.data?.message ||
                "Product could not be added."
            );
        } finally {
            setSaving(false);
        }
    };
    const handleCancel = () => {
        navigate("/products");
    };
    return (
        <div className="admin-products-layout">
            <main className="add-product-main">
                <div className="add-product-container">
                    <div className="add-product-topbar">
                        <div>
                            <p className="add-product-eyebrow">
                                BEAUTIQUE ADMIN PANEL
                            </p>
                            <h1>Add New Product</h1>
                            <p className="add-product-subtitle">
                                Add a new beauty product to your store.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="back-products-btn"
                            onClick={handleCancel}
                        >
                            <FaArrowLeft />
                            Back to Products
                        </button>
                    </div>
                    <form
                        className="add-product-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="add-product-card">
                            <div className="add-product-card-heading">
                                <div>
                                    <h2>Product Information</h2>
                                    <p>
                                        Enter the basic details of your product.
                                    </p>
                                </div>
                            </div>
                            {error && (
                                <div className="add-product-error">
                                    <span>{error}</span>
                                    <button
                                        type="button"
                                        onClick={() => setError("")}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            )}
                            <div className="add-product-grid">
                                {/* PRODUCT NAME */}
                                <div className="add-field full-width">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter product name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="add-field">
                                    <label>Category *</label>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        disabled={loadingCategories || categories.length === 0}
                                        required
                                    >
                                        <option value="" disabled>
                                            {loadingCategories
                                                ? "Loading categories..."
                                                : categories.length === 0
                                                    ? "No active categories available"
                                                    : "Select Category"}
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category._id}
                                                value={category.name}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {categoryError && (
                                        <small className="category-error">
                                            {categoryError}
                                        </small>
                                    )}
                                </div>
                                {/* PRICE */}
                                <div className="add-field">
                                    <label>Price *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        placeholder="599"
                                        value={form.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {/* RATING */}
                                <div className="add-field">
                                    <label>Rating</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        placeholder="4.5"
                                        value={form.rating}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* REVIEWS */}
                                <div className="add-field">
                                    <label>Reviews</label>
                                    <input
                                        type="number"
                                        name="reviews"
                                        min="0"
                                        placeholder="120"
                                        value={form.reviews}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* STOCK */}
                                <div className="add-field">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        min="0"
                                        placeholder="50"
                                        value={form.stock}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* BADGE */}
                                <div className="add-field">
                                    <label>Badge</label>
                                    <input
                                        type="text"
                                        name="badge"
                                        placeholder="NEW / BEST"
                                        value={form.badge}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* IMAGE */}
                                <div className="add-field full-width">
                                    <label>Add Image *</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required
                                    />
                                    <small>
                                        Upload product image (Maximum 5 MB)
                                    </small>
                                </div>
                                {/* IMAGE PREVIEW */}
                                {preview && (
                                    <div className="add-field full-width">
                                        <label>Image Preview</label>
                                        <div className="add-image-preview">
                                            <img
                                                src={preview}
                                                alt="Product preview"
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* DESCRIPTION */}
                                <div className="add-field full-width">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        rows="5"
                                        placeholder="Enter product description..."
                                        value={form.description}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="featured-field">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={isFeatured}
                                            onChange={(e) =>
                                                setIsFeatured(e.target.checked)
                                            }
                                        />
                                        Show on Home Page (Trending Products)
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* ACTION BUTTONS */}
                        <div className="add-product-actions">
                            <button
                                type="button"
                                className="add-cancel-btn"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="add-save-btn"
                                disabled={
                                    saving ||
                                    loadingCategories ||
                                    categories.length === 0
                                }
                            >
                                <FaPlus />
                                {saving ? "Saving..." : "Add Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};
export default AddProduct;
