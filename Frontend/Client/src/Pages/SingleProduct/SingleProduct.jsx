import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaStar,
    FaShoppingBag,
    FaBoxOpen,
    FaArrowLeft
} from "react-icons/fa";
import axios from "axios";
import { ProductContext } from "../../Context/ProductContext";
import "./SingleProduct.css";
const getProductImage = (image) => {
    if (!image) return "";
    if (typeof image === "string") {
        return image;
    }
    if (Array.isArray(image)) {
        return image[0]?.url || image[0]?.secure_url || "";
    }
    return image.url || image.secure_url || "";
};
const SingleProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        wishlist = [],
        toggleWishlist,
        addToCart
    } = useContext(ProductContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchSingleProduct = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/Product/getProductById/${id}`
                );
                const data = response.data;
                setProduct(data.product || data.data || data);
            } catch (err) {
                console.log("Fetch Single Product Error:", err);
                setError(
                    err.response?.data?.message ||
                    "Unable to load product details."
                );
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchSingleProduct();
        }
    }, [id]);
    if (loading) {
        return (
            <section className="product-not-found">
                <div className="product-detail-loader">
                    <FaShoppingBag />
                </div>
                <h2>Loading Product...</h2>
                <p>Please wait while we load the product details.</p>
            </section>
        );
    }
    if (error || !product) {
        return (
            <section className="product-not-found">
                <div className="product-detail-error-icon">
                    <FaBoxOpen />
                </div>
                <h2>Unable to Load Product</h2>
                <p>{error || "Product not found."}</p>
                <button
                    className="back-product-btn"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft />
                    Go Back
                </button>
            </section>
        );
    }
    const rating = Math.min(
        5,
        Math.max(0, Number(product.rating) || 0)
    );
    const reviews = Number(product.reviews) || 0;
    const price = Number(product.price) || 0;
    const stock = Number(product.stock) || 0;
    const image = getProductImage(
        product.image || product.images
    );
    const isWishlisted = wishlist.some(
        (item) => item._id === product._id
    );
    const handleAddToWishlist = () => {
        if (typeof toggleWishlist === "function") {
            toggleWishlist(product);
        }
    };
    const handleAddToCart = async () => {
        if (stock <= 0) return;
        const result = await addToCart(product._id);
        if (result?.unauthorized) {
            alert("Please login first to add products to cart.");
            navigate("/login");
            return;
        }
        if (!result?.success) {
            alert(result?.message || "Unable to add product to cart.");
        }
    };
    return (
        <section className="product-detail-page">
            <button
                type="button"
                className="back-product-btn"
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft />
                Back to Products
            </button>
            <div className="product-detail-box">
                <div className="product-detail-image">
                    {product.badge && (
                        <span className="detail-product-badge">
                            {product.badge}
                        </span>
                    )}
                    <button
                        type="button"
                        className="detail-wishlist-icon"
                        onClick={handleAddToWishlist}
                        aria-label="Add to wishlist"
                    >
                        <FaHeart
                            className={
                                isWishlisted
                                    ? "heart-active"
                                    : "heart-outline"
                            }
                        />
                    </button>
                    {image ? (
                        <img
                            src={image}
                            alt={product.name}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling.style.display = "flex";
                            }}
                        />
                    ) : null}
                    <div
                        className="detail-image-fallback"
                        style={{
                            display: image ? "none" : "flex"
                        }}
                    >
                        <FaBoxOpen />
                        <span>No Image Available</span>
                    </div>
                </div>
                <div className="product-detail-info">
                    <p className="detail-small-title">
                        BEAUTIQUE PREMIUM
                    </p>
                    <span className="detail-category">
                        {product.category}
                    </span>
                    <h1>{product.name}</h1>
                    <div className="detail-rating">
                        <div className="detail-stars">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={
                                        index < Math.round(rating)
                                            ? "star-active"
                                            : "star-inactive"
                                    }
                                />
                            ))}
                        </div>
                        <span>
                            {rating.toFixed(1)} ({reviews} Reviews)
                        </span>
                    </div>
                    <p className="detail-description">
                        {product.description ||
                            "Premium beauty product from Beautique. Carefully selected to bring quality, beauty and confidence to your everyday routine."}
                    </p>
                    <div className="detail-price">
                        ₹{price.toLocaleString("en-IN")}
                    </div>
                    <div
                        className={
                            stock > 0
                                ? "detail-stock in-stock"
                                : "detail-stock out-stock"
                        }
                    >
                        <span className="stock-dot"></span>
                        {stock > 0
                            ? `In Stock (${stock} available)`
                            : "Out of Stock"}
                    </div>
                    <div className="detail-buttons">
                        <button
                            type="button"
                            className="detail-wishlist-btn"
                            onClick={handleAddToWishlist}
                        >
                            <FaHeart
                                className={
                                    isWishlisted
                                        ? "heart-active"
                                        : ""
                                }
                            />
                            {isWishlisted
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"}
                        </button>
                        <button
                            type="button"
                            className="detail-cart-btn"
                            disabled={stock <= 0}
                            onClick={handleAddToCart}
                        >
                            <FaShoppingBag />
                            {stock > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>
                    </div>
                    <div className="product-extra-info">
                        <div className="extra-info-item">
                            <FaBoxOpen />
                            <div>
                                <strong>Product Category</strong>
                                <span>{product.category}</span>
                            </div>
                        </div>
                        <div className="extra-info-item">
                            <FaStar />
                            <div>
                                <strong>Customer Rating</strong>
                                <span>{rating.toFixed(1)} / 5</span>
                            </div>
                        </div>
                        <div className="extra-info-item">
                            <FaShoppingBag />
                            <div>
                                <strong>Availability</strong>
                                <span>
                                    {stock > 0
                                        ? "Available"
                                        : "Currently unavailable"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="product-review-box">
                        <h3>Customer Reviews</h3>
                        <div className="review-stars">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={
                                        index < Math.round(rating)
                                            ? "star-active"
                                            : "star-inactive"
                                    }
                                />
                            ))}
                        </div>
                        <p>
                            Loved by {reviews}+ beauty customers.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default SingleProduct;
