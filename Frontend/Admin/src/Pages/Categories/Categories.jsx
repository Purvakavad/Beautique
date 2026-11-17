import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaEye,
  FaTimes,
  FaTags,
  FaImage,
  FaHeart,
  FaStar,
  FaGem,
  FaLeaf,
  FaMagic,
  FaPaintBrush,
  FaTag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Categories.css";
const iconMap = {
  FaHeart,
  FaStar,
  FaGem,
  FaLeaf,
  FaMagic,
  FaPaintBrush,
  FaTag,
};
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/categories`;
const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    description: "",
    status: "true",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/getCategories`, {
        withCredentials: true,
      });
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Fetch Categories Error:", err);
      setError(
        err.response?.data?.message || "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  const handleView = async (id) => {
    try {
      setError("");
      setModalType("view");
      setSelectedCategory(null);
      const response = await axios.get(`${API_URL}/getSingleCategory/${id}`, {
        withCredentials: true,
      });
      setSelectedCategory(response.data.category);
    } catch (err) {
      console.error("Single Category Error:", err);
      setModalType("");
      setError(
        err.response?.data?.message || "Unable to fetch category details."
      );
    }
  };
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      title: category.title || "",
      name: category.name || "",
      shortDescription: category.shortDescription || "",
      description: category.description || "",
      icon: category.icon || "FaStar",
      status: category.status ? "true" : "false",
    });
    setImage(null);
    setImagePreview(category.image || "");
    setError("");
    setMessage("");
    setModalType("edit");
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
    setImagePreview(URL.createObjectURL(file));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
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
    try {
      setSaving(true);
      setError("");
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("name", formData.name.trim());
      data.append("shortDescription", formData.shortDescription.trim());
      data.append("description", formData.description.trim());
      data.append("icon", formData.icon);
      data.append("status", formData.status);
      if (image) {
        data.append("image", image);
      }
      const response = await axios.put(
        `${API_URL}/updateCategory/${selectedCategory._id}`,
        data,
        {
          withCredentials: true,
        }
      );
      setCategories((previous) =>
        previous.map((category) =>
          category._id === selectedCategory._id
            ? response.data.category
            : category
        )
      );
      setMessage("Category updated successfully!");
      setModalType("");
      setSelectedCategory(null);
      setImage(null);
      setImagePreview("");
    } catch (err) {
      console.error("Update Category Error:", err);
      setError(
        err.response?.data?.message || "Failed to update category."
      );
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setModalType("delete");
    setError("");
  };
  const handleDelete = async () => {
    try {
      setSaving(true);
      setError("");
      await axios.delete(
        `${API_URL}/deleteCategory/${selectedCategory._id}`,
        {
          withCredentials: true,
        }
      );
      setCategories((previous) =>
        previous.filter(
          (category) => category._id !== selectedCategory._id
        )
      );
      setMessage("Category deleted successfully!");
      setModalType("");
      setSelectedCategory(null);
    } catch (err) {
      console.error("Delete Category Error:", err);
      setError(
        err.response?.data?.message || "Failed to delete category."
      );
    } finally {
      setSaving(false);
    }
  };
  const closeModal = () => {
    setModalType("");
    setSelectedCategory(null);
    setError("");
    setFormData({
      title: "",
      name: "",
      shortDescription: "",
      description: "",
      icon: "FaStar",
      status: "true",
    });
    setImage(null);
    setImagePreview("");
  };
  return (
    <main className="admin-category-page">
      <div className="category-header">
        <div>
          <p className="category-small-title">BEAUTIQUE ADMIN PANEL</p>
          <h1>Category Management</h1>
          <p className="category-subtitle">
            Manage your product categories
          </p>
        </div>
        <div className="category-header-buttons">
          <button
            className="category-add-btn"
            onClick={() => navigate("/categories/add")}
            type="button"
          >
            <FaPlus /> Add Category
          </button>
        </div>
      </div>
      {message && (
        <div className="category-success-message">
          {message}
          <button onClick={() => setMessage("")} type="button">
            <FaTimes />
          </button>
        </div>
      )}
      {error && !modalType && (
        <div className="category-error-message">{error}</div>
      )}
      <div className="category-summary">
        <div className="category-count-box">
          <div className="category-count-icon">
            <FaTags />
          </div>
          <div>
            <span>Total Categories</span>
            <strong>{categories.length}</strong>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="category-loading">
          <FaSyncAlt className="category-loading-icon" />
          <h3>Loading Categories...</h3>
          <p>Please wait while categories are loading.</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="category-empty">
          <FaTags className="category-empty-icon" />
          <h3>No Categories Found</h3>
          <p>Start by adding your first category.</p>
          <button
            className="category-add-btn"
            onClick={() => navigate("/categories/add")}
            type="button"
          >
            <FaPlus /> Add First Category
          </button>
        </div>
      ) : (
        <div className="category-table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Total Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category._id}>
                  <td>{index + 1}</td>
                  <td>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="category-table-image"
                      />
                    ) : (
                      <div className="category-no-image">
                        <FaImage />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="category-name-cell">
                      <strong>{category.name}</strong>
                    </div>
                  </td>
                  <td>
                    {category.description || "No description"}
                  </td>
                  <td>
                    <span className="category-product-count">
                      {category.productCount ?? 0} Products
                    </span>
                  </td>
                  <td>
                    <div className="category-actions">
                      <button
                        className="category-view-btn"
                        onClick={() => handleView(category._id)}
                        title="View"
                        type="button"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="category-edit-btn"
                        onClick={() => handleEdit(category)}
                        title="Edit"
                        type="button"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="category-delete-btn"
                        onClick={() => handleDeleteClick(category)}
                        title="Delete"
                        type="button"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modalType === "view" && (
        <div className="category-modal-overlay" onClick={closeModal}>
          <div
            className="category-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="category-modal-header">
              <div>
                <p>BEAUTIQUE</p>
                <h2>Category Details</h2>
              </div>
              <button onClick={closeModal} type="button">
                <FaTimes />
              </button>
            </div>
            {!selectedCategory ? (
              <div className="category-modal-loading">
                Loading category details...
              </div>
            ) : (
              <div className="category-view-content">
                <div className="category-detail-image">
                  {selectedCategory.image ? (
                    <img
                      src={selectedCategory.image}
                      alt={selectedCategory.name}
                    />
                  ) : (
                    <div className="category-no-image large">
                      <FaImage />
                    </div>
                  )}
                </div>
                <div className="category-detail-item">
                  <span>Category ID</span>
                  <strong>{selectedCategory._id}</strong>
                </div>
                <div className="category-detail-item">
                  <span>Category Title</span>
                  <strong>{selectedCategory.title}</strong>
                </div>
                <div className="category-detail-item">
                  <span>Category Name</span>
                  <strong>{selectedCategory.name}</strong>
                </div>
                <div className="category-detail-item">
                  <span>Description</span>
                  <p>{selectedCategory.description}</p>
                </div>
                <div className="category-detail-item">
                  <span>Status</span>
                  <strong className={selectedCategory.status ? "status-active" : "status-inactive"}>
                    {selectedCategory.status ? "Active" : "Inactive"}
                  </strong>
                </div>
                <div className="category-detail-item">
                  <span>Total Products</span>
                  <strong>{selectedCategory.productCount ?? 0}</strong>
                </div>
              </div>
            )}
            <div className="category-modal-footer">
              <button
                className="category-cancel-btn"
                onClick={closeModal}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {modalType === "edit" && (
        <div className="category-modal-overlay" onClick={closeModal}>
          <div
            className="category-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="category-modal-header">
              <div>
                <p>BEAUTIQUE</p>
                <h2>Update Category</h2>
              </div>
              <button onClick={closeModal} type="button">
                <FaTimes />
              </button>
            </div>
            <form
              className="category-form"
              onSubmit={handleUpdate}
            >
              <div className="category-form-group">
                <label>Category Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter category title"
                  required
                />
              </div>
              <div className="category-form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="category-form-group">
                <label>Short Description *</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="e.g. Elegant Looks"
                  maxLength={60}
                  required
                />
              </div>
              <div className="category-form-group">
                <label>Category Icon *</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  required
                >
                  <option value="FaHeart">Heart</option>
                  <option value="FaStar">Star</option>
                  <option value="FaGem">Gem</option>
                  <option value="FaLeaf">Leaf</option>
                  <option value="FaMagic">Magic</option>
                  <option value="FaPaintBrush">Paint Brush</option>
                  <option value="FaTag">Tag</option>
                </select>
              </div>
              <div className="category-form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  rows="4"
                  required
                />
              </div>
              <div className="category-form-group">
                <label>Category Image</label>
                {imagePreview && (
                  <div className="category-edit-image-preview">
                    <img src={imagePreview} alt="Category preview" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small>
                  Select a new image only if you want to replace the current image.
                </small>
              </div>
              <div className="category-form-group">
                <label>Category Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="category-modal-footer">
                <button
                  type="button"
                  className="category-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="category-update-btn"
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modalType === "delete" && selectedCategory && (
        <div className="category-modal-overlay" onClick={closeModal}>
          <div
            className="category-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="category-delete-icon">
              <FaTrash />
            </div>
            <h2>Delete Category?</h2>
            <p className="category-delete-warning">
              Are you sure you want to delete this category?
              This action cannot be undone.
            </p>
            <div className="category-delete-details">
              {selectedCategory.image && (
                <img
                  src={selectedCategory.image}
                  alt={selectedCategory.name}
                />
              )}
              <p>
                <strong>Title:</strong> {selectedCategory.title}
              </p>
              <p>
                <strong>Name:</strong> {selectedCategory.name}
              </p>
              <p>
                <strong>Description:</strong> {selectedCategory.description}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedCategory.status ? "Active" : "Inactive"}
              </p>
              <p>
                <strong>Total Products:</strong>{" "}
                {selectedCategory.productCount ?? 0}
              </p>
            </div>
            {/* DELETE MODAL BUTTONS */}
            <div className="category-delete-actions">
              <button
                type="button"
                className="category-delete-cancel-btn"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="category-delete-confirm-btn"
                onClick={handleDelete}
                disabled={saving || (selectedCategory.productCount ?? 0) > 0}
              >
                <FaTrash />
                {saving ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
export default Categories;
