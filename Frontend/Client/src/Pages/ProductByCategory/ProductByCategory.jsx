import { FaHeart, FaShoppingBag } from "react-icons/fa";
import "./ProductByCategory.css";
import { useContext } from "react";
import { ProductContext } from "../../Context/ProductContext";
import { useSearchParams } from "react-router-dom";
const ProductByCategory = ({ category }) => {
    const [searchParams] = useSearchParams();
    const urlCategory = searchParams.get("category");
    const selectedCategory = (
        urlCategory || category || "all"
    ).toLowerCase().trim();
    const {
        products,
        categories,
        searchQuery,
        wishlist,
        toggleWishlist,
        addToCart,
        navigate
    } = useContext(ProductContext);
    const details = categories.find(
        (cat) => cat.name?.toLowerCase().trim() === selectedCategory
    );
    const categoryProducts =
        selectedCategory === "all"
            ? products
            : products.filter(
                (product) =>
                    product.category?.toLowerCase().trim() === selectedCategory
            );
    const filteredProducts = categoryProducts.filter((product) => {
        const search = searchQuery.toLowerCase().trim();
        return (
            product.name?.toLowerCase().includes(search) ||
            product.category?.toLowerCase().includes(search)
        );
    });
    const handleAddToCart = async (e, productId) => {
        e.stopPropagation();
        const result = await addToCart(productId);
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
        <div className="common-product-page">
            <section className="product-page-header">
                <span className="product-header-small">
                    BEAUTIQUE PREMIUM
                </span>
                <h1>
                    {selectedCategory === "all"
                        ? "All Products"
                        : details?.title || details?.name || "Beauty Collection"}
                </h1>
                <p>
                    {selectedCategory === "all"
                        ? "Explore our complete beauty collection."
                        : details?.description || details?.shortDescription || ""}
                </p>
            </section>
            <section className="common-products-section">
                {filteredProducts.length > 0 ? (
                    <div className="common-products-grid">
                        {filteredProducts.map((product) => (
                            <div
                                className="common-product-card"
                                key={product._id}
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <div className="common-product-image">
                                    {product.badge && (
                                        <span className="common-product-badge">
                                            {product.badge}
                                        </span>
                                    )}
                                    <button
                                        className="common-wishlist-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist(product);
                                        }}
                                        aria-label="Add to wishlist"
                                    >
                                        <FaHeart
                                            className={
                                                wishlist.some(
                                                    (item) => item._id === product._id
                                                )
                                                    ? "heart-active"
                                                    : "heart-outline"
                                            }
                                        />
                                    </button>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />
                                </div>
                                <div className="common-product-details">
                                    <span className="common-product-category">
                                        {product.category}
                                    </span>
                                    <h3>{product.name}</h3>
                                    <div className="common-product-rating">
                                        <span>★★★★★</span>
                                        <small>
                                            ({product.reviews ?? 0})
                                        </small>
                                    </div>
                                    <div className="common-product-bottom">
                                        <h4>
                                            ₹{Number(product.price).toLocaleString("en-IN")}
                                        </h4>
                                        <button
                                            className="common-add-cart-btn"
                                            onClick={(e) => handleAddToCart(e, product._id)}
                                        >
                                            <FaShoppingBag />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-products">
                        <h3>No Products Found</h3>
                        <p>
                            {searchQuery.trim()
                                ? `No products found for "${searchQuery}".`
                                : "Products will appear here when available."}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};
export default ProductByCategory;
