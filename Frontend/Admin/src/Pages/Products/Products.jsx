import { useEffect, useMemo, useState } from "react";
import "./Products.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye, FaTrash, FaEdit
} from "react-icons/fa";
const Products = ({
  onDeleteProduct,
}) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    rating: "",
    reviews: "",
    stock: "",
    badge: "",
    image: "",
    description: "",
    isFeatured: false
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/Product/getProducts`, { withCredentials: true });
      console.log("Products Response:", response.data);
      const data = response.data;
      setProducts(
        Array.isArray(data)
          ? data
          : data.products || data.data || []
      );
    } catch (err) {
      console.log("Fetch Products Error:", err);
    }
  };
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/categories/getCategories`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const activeCategories = response.data.categories.filter(
          (category) => category.status === true
        );
        setCategories(activeCategories);
      }
    } catch (error) {
      console.log("Fetch Categories Error:", error);
    } finally {
      setLoadingCategories(false);
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);
  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };
  const handleViewClick = async (id) => {
    try {
      setViewLoading(true);
      setViewProduct(null);
      setIsViewOpen(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/Product/getProductById/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setViewProduct(response.data.product);
      }
    } catch (error) {
      console.log("Get Single Product Error:", error);
      setIsViewOpen(false);
      alert(
        error.response?.data?.message ||
        "Unable to fetch product details."
      );
    } finally {
      setViewLoading(false);
    }
  };
  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewProduct(null);
  };
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    console.log("update btn click")
    setFormData({
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      rating: product.rating ?? "",
      reviews: product.reviews ?? "",
      stock: product.stock ?? "",
      badge: product.badge || "",
      image: product.image || "",
      description: product.description || "",
      isFeatured: product.isFeatured ?? false
    });
    setEditImage(null);
    setEditPreview(product.image || "");
    setIsEditOpen(true);
  };
  useEffect(() => {
    console.log("Modal Open:", isEditOpen);
  }, [isEditOpen]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCloseModal = () => {
    setIsEditOpen(false);
    setSelectedProduct(null);
    setEditImage(null);
    setEditPreview("");
  };
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }
    setEditImage(file);
    setEditPreview(URL.createObjectURL(file));
  };
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (isUpdating) return;
    try {
      setIsUpdating(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image") {
          data.append(key, value);
        }
      });
      if (editImage) {
        data.append("image", editImage);
      }
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/Product/updateProduct/${selectedProduct._id}`,
        data,
        { withCredentials: true }
      );
      console.log("pro up", response.data)
      if (response.data.success) {
        alert("Product updated successfully!");
        handleCloseModal();
        fetchProducts();
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Product update failed");
    } finally {
      setIsUpdating(false);
    }
  }
  const handleDeleteClick = (product) => {
    setDeleteProduct(product);
  };
  const handleConfirmDelete = async () => {
    if (!deleteProduct || isDeleting) return;
    try {
      setIsDeleting(true);
      await onDeleteProduct?.(deleteProduct);
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/product/deleteProduct/${deleteProduct._id}`)
      setDeleteProduct(null);
      fetchProducts();
    } catch (error) {
      console.log("Delete Product Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      <div className="products-page">
        {/* Page Header */}
        <div className="products-header">
          <div className="products-heading">
            <span className="products-subtitle">
              BEAUTIQUE ADMIN PANEL
            </span>
            <h1>Products</h1>
            <p>
              Manage all your Beautique products from MongoDB.
            </p>
          </div>
          <button
            className="add-product-btn"
            onClick={() => { navigate("/add-product") }}
          >
            <span>+</span>
            Add Product
          </button>
        </div>
        {/* Search and Filter */}
        <div className="products-filter">
          <div className="product-search">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search product by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <div className="category-filter">
            <label htmlFor="product-category">
              Category:
            </label>
            <select
              id="product-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={loadingCategories}
            >
              <option value="All Categories">
                {loadingCategories ? "Loading categories..." : "All Categories"}
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Product Count */}
        <div className="product-count">
          <span>✿</span>
          Showing <strong>{filteredProducts.length}</strong> of{" "}
          <strong>{products.length}</strong> products
        </div>
        {/* Product Table */}
        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>IMAGE</th>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>RATING</th>
                <th>STOCK</th>
                <th>BADGE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id || product.id}>
                    <td data-label="IMAGE">
                      <img
                        className="product-image"
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                      />
                    </td>
                    <td data-label="PRODUCT">
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>{product.description}</p>
                      </div>
                    </td>
                    <td data-label="CATEGORY">
                      <span className="category-badge">
                        {product.category}
                      </span>
                    </td>
                    <td data-label="PRICE">
                      <span className="product-price">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td data-label="RATING">
                      <div className="product-rating">
                        <span className="star-icon">★</span>
                        <strong>{product.rating || 0}</strong>
                        <small>({product.reviews || 0})</small>
                      </div>
                    </td>
                    <td data-label="STOCK">
                      <span
                        className={`stock-badge ${Number(product.stock) <= 10
                          ? "low-stock"
                          : ""
                          }`}
                      >
                        {product.stock ?? 0}
                      </span>
                    </td>
                    <td data-label="BADGE">
                      {product.badge ? (
                        <span className="product-badge">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="no-badge">—</span>
                      )}
                    </td>
                    <td data-label="ACTIONS">
                      <div className="product-actions">
                        <button
                          className="view-product-btn"
                          onClick={() => handleViewClick(product._id)}
                          title="View Product"
                          aria-label={`View ${product.name}`}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="edit-product-btn"
                          onClick={() => handleEditClick(product)}
                          title="Edit Product"
                          aria-label={`Edit ${product.name}`}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="delete-product-btn"
                          onClick={() => handleDeleteClick(product)}
                          title="Delete Product"
                          aria-label={`Delete ${product.name}`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan="8">
                    <div className="empty-products">
                      <span>♡</span>
                      <h3>No Products Found</h3>
                      <p>
                        Try searching with another product name
                        or category.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div >
      {/* VIEW SINGLE PRODUCT MODAL */}
      {isViewOpen && (
        <div
          className="view-product-overlay"
          onClick={handleCloseView}
        >
          <div
            className="view-product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="view-product-header">
              <div>
                <span>BEAUTIQUE PRODUCT</span>
                <h2>Product Details</h2>
              </div>
              <button
                type="button"
                onClick={handleCloseView}
              >
                ×
              </button>
            </div>
            {/* LOADING */}
            {viewLoading ? (
              <div className="view-product-loading">
                Loading product details...
              </div>
            ) : viewProduct ? (
              <>
                {/* PRODUCT IMAGE */}
                <div className="view-product-image">
                  <img
                    src={viewProduct.image || "/placeholder.png"}
                    alt={viewProduct.name}
                  />
                </div>
                {/* PRODUCT NAME */}
                <div className="view-product-title">
                  <h3>{viewProduct.name}</h3>
                  <span className="view-product-category">
                    {viewProduct.category}
                  </span>
                </div>
                {/* PRODUCT DETAILS */}
                <div className="view-product-details">
                  <div className="view-detail-item">
                    <span>Product ID</span>
                    <strong>{viewProduct._id}</strong>
                  </div>
                  <div className="view-detail-item">
                    <span>Product Name</span>
                    <strong>{viewProduct.name}</strong>
                  </div>
                  <div className="view-detail-item">
                    <span>Category</span>
                    <strong>{viewProduct.category}</strong>
                  </div>
                  <div className="view-detail-item">
                    <span>Price</span>
                    <strong>
                      ₹{Number(viewProduct.price || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="view-detail-item">
                    <span>Rating</span>
                    <strong>★ {viewProduct.rating || 0} / 5</strong>
                  </div>
                  <div className="view-detail-item">
                    <span>Total Reviews</span>
                    <strong>{viewProduct.reviews || 0}</strong>
                  </div>
                  <div className="view-detail-item">
                    <span>Available Stock</span>
                    <strong>{viewProduct.stock ?? 0}</strong>
                  </div>
                  <div className="view-detail-item">
                    <span>Badge</span>
                    <strong>{viewProduct.badge || "No Badge"}</strong>
                  </div>
                  <div className="view-detail-item view-detail-description">
                    <span>Description</span>
                    <p>
                      {viewProduct.description || "No description available."}
                    </p>
                  </div>
                </div>
                {/* FOOTER */}
                <div className="view-product-footer">
                  <button
                    type="button"
                    onClick={handleCloseView}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div className="view-product-loading">
                Product details not found.
              </div>
            )}
          </div>
        </div>
      )}
      {/* EDIT PRODUCT MODAL */}
      {isEditOpen && (
        <div className="edit-modal-overlay" onClick={handleCloseModal}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <div>
                <span>BEAUTIQUE PRODUCT</span>
                <h2>Edit Product</h2>
              </div>
              <button
                type="button"
                className="edit-modal-close"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <form className="edit-product-form" onSubmit={handleUpdateProduct}>
              <label className="form-full">
                Product Name *
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Category *
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {["Makeup", "Skincare", "Perfume", "Haircare", "Nail Care", "Body Care"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>
              <label>
                Price *
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Rating
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </label>
              <label>
                Reviews
                <input
                  type="number"
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleChange}
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </label>
              <label>
                Badge
                <input
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                />
              </label>
              <div className="form-full featured-checkbox-field">
                <label className="featured-checkbox-label">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    className="checkbox"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked
                      }))
                    }
                  />
                  <span>Show on Home Page</span>
                </label>
              </div>
              <div className="form-full edit-image-field">
                <label htmlFor="edit-product-image">
                  Change Product Image
                </label>
                <input
                  id="edit-product-image"
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                />
                <small>Select a new image if you want to replace the current one.</small>
                {editPreview && (
                  <div className="edit-image-preview">
                    <img src={editPreview} alt="Product Preview" />
                  </div>
                )}
              </div>
              <label className="form-full">
                Description
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </label>
              <div className="edit-modal-footer form-full">
                <button type="button" className="edit-cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="edit-update-btn">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DELETE CONFIRMATION MODAL */}
      {deleteProduct && (
        <div
          className="delete-modal-overlay"
          onClick={() => !isDeleting && setDeleteProduct(null)}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">
              !
            </div>
            <h2>Delete Product?</h2>
            <p>
              Are you sure you want to delete
              <strong> {deleteProduct.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-btn"
                onClick={() => setDeleteProduct(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-confirm-btn"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Products;
