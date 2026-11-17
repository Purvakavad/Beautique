import { useContext, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from "react-icons/fa";
import "./Cart.css";
import { ProductContext } from "../../Context/ProductContext";
function Cart() {
  const { cartItems, setCartItems, navigate } = useContext(ProductContext);
  const [loadingId, setLoadingId] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL;
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      setLoadingId(productId);
      const response = await axios.put(
        `${API}/api/cart/update`,
        {
          productId,
          quantity
        },
        {
          withCredentials: true
        }
      );
      if (response.data.success) {
        setCartItems(response.data.cart.items || []);
      }
    } catch (error) {
      console.log(
        "Update Quantity Error:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
        "Unable to update quantity"
      );
    } finally {
      setLoadingId(null);
    }
  };
  const removeProduct = async (productId) => {
    try {
      setLoadingId(productId);
      const response = await axios.delete(
        `${API}/api/cart/remove/${productId}`,
        {
          withCredentials: true
        }
      );
      if (response.data.success) {
        setCartItems(response.data.cart.items || []);
      }
    } catch (error) {
      console.log(
        "Remove Cart Error:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
        "Unable to remove product"
      );
    } finally {
      setLoadingId(null);
    }
  };
  const cartTotal = cartItems.reduce((total, item) => {
    const product = item.productId;
    if (!product) return total;
    return total + Number(product.price || 0) * item.quantity;
  }, 0);
  if (cartItems.length === 0) {
    return (
      <section className="cart-section">
        <div className="cart-title">
          <span>SHOPPING CART</span>
          <h1>Your Cart</h1>
        </div>
        <div className="empty-cart">
          <FaShoppingBag className="empty-cart-icon" />
          <h2>Your Cart is Empty</h2>
          <p>
            You haven't added any beauty products yet.
          </p>
          <button onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }
  return (
    <section className="cart-section">
      <div className="cart-title">
        <span>SHOPPING CART</span>
        <h1>Your Cart</h1>
        <p>
          You have {cartItems.length} different products in your cart.
        </p>
      </div>
      <div className="cart-layout">
        <div className="cart-products">
          {cartItems.map((item) => {
            const product = item.productId;
            if (!product) return null;
            const productId = product._id;
            const subtotal =
              Number(product.price || 0) * item.quantity;
            const isLoading = loadingId === productId;
            return (
              <div className="cart-item" key={productId}>
                <div className="cart-product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </div>
                <div className="cart-info">
                  <span className="cart-category">
                    {product.category || "Beauty Product"}
                  </span>
                  <h3>{product.name}</h3>
                  <p className="cart-product-price">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </p>
                  <div className="cart-quantity">
                    <button
                      type="button"
                      disabled={isLoading || item.quantity <= 1}
                      onClick={() =>
                        updateQuantity(
                          productId,
                          item.quantity - 1
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        updateQuantity(
                          productId,
                          item.quantity + 1
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className="cart-item-right">
                  <h3>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </h3>
                  <button
                    type="button"
                    className="remove-btn"
                    disabled={isLoading}
                    onClick={() => removeProduct(productId)}
                  >
                    <FaTrash />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
          <button
            className="continue-shopping"
            onClick={() => navigate("/products")}
          >
            ← Continue Shopping
          </button>
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Total Products</span>
            <span>{cartItems.reduce(
              (total, item) => total + item.quantity,
              0
            )}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              ₹{cartTotal.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-total">
            <span>Grand Total</span>
            <h2>
              ₹{cartTotal.toLocaleString("en-IN")}
            </h2>
          </div>
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
          <p className="summary-note">
            Your order details will be confirmed at checkout.
          </p>
        </div>
      </div>
    </section>
  );
}
export default Cart;
