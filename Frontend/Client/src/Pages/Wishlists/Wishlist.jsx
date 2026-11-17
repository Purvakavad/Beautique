import { useContext } from "react";
import { ProductContext } from "../../Context/ProductContext";
import {
  FaHeart,
  FaShoppingBag,
  FaTrash
} from "react-icons/fa";
import "./Wishlist.css";
const getProductImage = (image) => {
  if (typeof image === "string") {
    return image;
  }
  return image?.url || image?.secure_url || "";
};
function Wishlist() {
  const { wishlist = [], toggleWishlist, navigate } =
    useContext(ProductContext);
  return (
    <div className="wishlist-page">
      {/* ================= HERO ================= */}
      <section className="wishlist-hero">
        <div className="wishlist-content">
          <p className="wishlist-small-title">
            YOUR BEAUTY COLLECTION
          </p>
          <h1>
            My <span>Wishlist</span>
          </h1>
          <p>
            Save your favourite beauty products
            and find them whenever you need.
          </p>
        </div>
      </section>
      <section className="wishlist-section">
        {wishlist.length === 0 ? (
          <div className="wishlist-card">
            <div className="wishlist-icon">
              <FaHeart />
            </div>
            <h2>
              Your Wishlist is Empty
            </h2>
            <p>
              You haven't added any favourite
              products yet. Explore our collection
              and save your favourites.
            </p>
            <button
              type="button"
              onClick={() => navigate("/products")}
            >
              <FaShoppingBag />
              Explore Products
            </button>
          </div>
        ) : (
          <div className="wishlist-products">
            {wishlist.map((product, index) => {
              const productId =
                product._id || product.id;
              const image = getProductImage(
                product.image
              );
              return (
                <div
                  className="wishlist-product-card"
                  key={productId || index}
                >
                  {/* IMAGE */}
                  <div className="wishlist-product-image">
                    {/* REMOVE HEART */}
                    <button
                      type="button"
                      className="wishlist-remove-top"
                      onClick={() =>
                        toggleWishlist(product)
                      }
                      aria-label="Remove from wishlist"
                    >
                      <FaHeart />
                    </button>
                    {image ? (
                      <img
                        src={image}
                        alt={product.name || "Beauty Product"}
                      />
                    ) : (
                      <div
                        style={{
                          width: "185px",
                          height: "185px",
                          borderRadius: "12px",
                          background: "#fff0f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: "8px",
                          color: "#d63384",
                          fontSize: "13px",
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        <FaShoppingBag size={30} />
                        <span>
                          No Image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="wishlist-product-info">
                    <span>
                      {product.category}
                    </span>
                    <h3>
                      {product.name}
                    </h3>
                    <p className="wishlist-price">
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString("en-IN")}
                    </p>
                    <div className="wishlist-buttons">
                      <button
                        type="button"
                        className="wishlist-cart-btn"
                        onClick={() =>
                          navigate(
                            productId
                              ? `/product/${productId}`
                              : "/products"
                          )
                        }
                      >
                        <FaShoppingBag />
                        View Product
                      </button>
                      <button
                        type="button"
                        className="wishlist-delete-btn"
                        onClick={() =>
                          toggleWishlist(product)
                        }
                        aria-label="Delete from wishlist"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
export default Wishlist;
