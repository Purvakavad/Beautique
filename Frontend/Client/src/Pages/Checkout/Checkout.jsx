import { useContext, useState } from "react";
import axios from "axios";
import {
    FaMapMarkerAlt,
    FaCreditCard,
    FaMoneyBillWave,
    FaLock,
    FaArrowLeft
} from "react-icons/fa";
import { ProductContext } from "../../Context/ProductContext";
import "./Checkout.css";
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    });
};
function Checkout() {
    const { cartItems, setCartItems, navigate } = useContext(ProductContext);
    const API = import.meta.env.VITE_BACKEND_URL;
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const cartTotal = cartItems.reduce((total, item) => {
        const product = item.productId;
        if (!product) return total;
        return total +
            Number(product.price || 0) *
            Number(item.quantity || 0);
    }, 0);
    const totalQuantity = cartItems.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            alert("Your cart is empty");
            navigate("/cart");
            return;
        }
        if (loading) return;
        try {
            setLoading(true);
            if (paymentMethod === "COD") {
                const response = await axios.post(
                    `${API}/api/order/create`,
                    {
                        ...formData,
                        paymentMethod: "COD"
                    },
                    {
                        withCredentials: true
                    }
                );
                if (response.data.success) {
                    setCartItems([]);
                    navigate("/order-success", {
                        state: {
                            order: response.data.order
                        }
                    });
                }
                return;
            }
            if (paymentMethod === "RAZORPAY") {
                const isLoaded = await loadRazorpayScript();
                if (!isLoaded) {
                    alert("Razorpay SDK failed to load. Please try again.");
                    return;
                }
                const response = await axios.post(
                    `${API}/api/order/razorpay/create`,
                    formData,
                    {
                        withCredentials: true
                    }
                );
                if (!response.data.success) {
                    alert(response.data.message);
                    return;
                }
                const {
                    keyId,
                    razorpayOrder
                } = response.data;
                const options = {
                    key: keyId,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: "Beautique",
                    description: "Beauty Products Order",
                    order_id: razorpayOrder.id,
                    prefill: {
                        name: formData.fullName,
                        email: formData.email,
                        contact: formData.phone
                    },
                    theme: {
                        color: "#d85b91"
                    },
                    handler: async function (paymentResponse) {
                        try {
                            setLoading(true);
                            const verifyResponse = await axios.post(
                                `${API}/api/order/razorpay/verify`,
                                paymentResponse,
                                {
                                    withCredentials: true
                                }
                            );
                            if (verifyResponse.data.success) {
                                setCartItems([]);
                                navigate("/order-success", {
                                    state: {
                                        order: verifyResponse.data.order
                                    }
                                });
                            } else {
                                alert(
                                    verifyResponse.data.message ||
                                    "Payment verification failed"
                                );
                            }
                        } catch (error) {
                            console.log(
                                "PAYMENT VERIFY ERROR:",
                                error.response?.data || error.message
                            );
                            alert(
                                error.response?.data?.message ||
                                "Payment verification failed. Please contact support."
                            );
                        } finally {
                            setLoading(false);
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setLoading(false);
                        }
                    }
                };
                const razorpay = new window.Razorpay(options);
                razorpay.on("payment.failed", async function (response) {
                    console.log("PAYMENT FAILED:", response.error);
                    const metadata = response.error?.metadata || {};
                    try {
                        if (metadata.order_id && metadata.payment_id) {
                            const failureResponse = await axios.post(
                                `${API}/api/order/razorpay/failed`,
                                {
                                    razorpay_order_id: metadata.order_id,
                                    razorpay_payment_id: metadata.payment_id
                                },
                                {
                                    withCredentials: true
                                }
                            );
                            console.log(
                                "PAYMENT FAILURE SAVED:",
                                failureResponse.data
                            );
                        } else {
                            console.log(
                                "Razorpay did not provide payment failure metadata"
                            );
                        }
                    } catch (error) {
                        console.log(
                            "FAILURE UPDATE ERROR:",
                            error.response?.data || error.message
                        );
                    } finally {
                        alert(
                            response.error?.description ||
                            "Payment failed. Please try again."
                        );
                        setLoading(false);
                    }
                });
                razorpay.open();
                return;
            }
            if (paymentMethod === "STRIPE") {
                const response = await axios.post(
                    `${API}/api/order/stripe/create`,
                    formData,
                    {
                        withCredentials: true
                    }
                );
                if (!response.data.success || !response.data.url) {
                    alert(
                        response.data.message ||
                        "Unable to start Stripe payment"
                    );
                    return;
                }
                window.location.href = response.data.url;
                return;
            }
        } catch (error) {
            console.log(
                "PLACE ORDER ERROR:",
                error.response?.data || error.message
            );
            alert(
                error.response?.data?.message ||
                "Unable to place your order"
            );
        } finally {
            setLoading(false);
        }
    };
    if (cartItems.length === 0) {
        return (
            <section className="checkout-empty">
                <h2>Your Cart is Empty</h2>
                <p>Please add products before checkout.</p>
                <button onClick={() => navigate("/products")}>
                    Continue Shopping
                </button>
            </section>
        );
    }
    return (
        <section className="checkout-section">
            <div className="checkout-header">
                <span>BEAUTIQUE CHECKOUT</span>
                <h1>Complete Your Order</h1>
                <p>
                    Just a few more steps to get your beauty essentials.
                </p>
            </div>
            <form
                className="checkout-layout"
                onSubmit={handlePlaceOrder}
            >
                <div className="checkout-left">
                    <div className="checkout-card">
                        <div className="checkout-card-title">
                            <FaMapMarkerAlt />
                            <h2>Delivery Address</h2>
                        </div>
                        <div className="checkout-form-grid">
                            <div className="checkout-field full-width">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="checkout-field">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="checkout-field">
                                <label>Mobile Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="10 digit mobile number"
                                    pattern="[0-9]{10}"
                                    maxLength="10"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="checkout-field full-width">
                                <label>House / Street Address *</label>
                                <textarea
                                    name="address"
                                    placeholder="Enter your complete address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="checkout-field">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Enter city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="checkout-field">
                                <label>State *</label>
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="Enter state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="checkout-field full-width">
                                <label>PIN Code *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="6 digit PIN code"
                                    pattern="[0-9]{6}"
                                    maxLength="6"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="checkout-card">
                        <div className="checkout-card-title">
                            <FaCreditCard />
                            <h2>Payment Method</h2>
                        </div>
                        <div className="payment-options">
                            <label
                                className={`payment-option ${paymentMethod === "COD" ? "selected" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === "COD"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                />
                                <FaMoneyBillWave className="payment-icon" />
                                <div>
                                    <h3>Cash on Delivery</h3>
                                    <p>Pay when your order arrives.</p>
                                </div>
                            </label>
                            <label
                                className={`payment-option ${paymentMethod === "RAZORPAY" ? "selected" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="RAZORPAY"
                                    checked={paymentMethod === "RAZORPAY"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                />
                                <img
                                    src="https://razorpay.com/assets/razorpay-logo.svg"
                                    alt="Razorpay"
                                    className="payment-logo"
                                />
                                <div>
                                    <h3>Razorpay</h3>
                                    <p>UPI, Cards, Net Banking and more.</p>
                                </div>
                            </label>
                            <label
                                className={`payment-option ${paymentMethod === "STRIPE" ? "selected" : ""
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="STRIPE"
                                    checked={paymentMethod === "STRIPE"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                />
                                <FaCreditCard className="payment-icon stripe-icon" />
                                <div>
                                    <h3>Stripe</h3>
                                    <p>Secure online card payment.</p>
                                </div>
                            </label>
                        </div>
                        <p className="payment-security">
                            <FaLock /> Your payment information is handled securely.
                        </p>
                    </div>
                </div>
                <div className="checkout-right">
                    <div className="checkout-summary">
                        <h2>Order Summary</h2>
                        <div className="checkout-products">
                            {cartItems.map((item) => {
                                const product = item.productId;
                                if (!product) return null;
                                return (
                                    <div
                                        className="checkout-product"
                                        key={product._id}
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                        />
                                        <div className="checkout-product-info">
                                            <h4>{product.name}</h4>
                                            <p>Qty: {item.quantity}</p>
                                        </div>
                                        <strong>
                                            ₹{(
                                                Number(product.price) *
                                                item.quantity
                                            ).toLocaleString("en-IN")}
                                        </strong>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="checkout-divider"></div>
                        <div className="checkout-summary-row">
                            <span>Total Products</span>
                            <strong>{totalQuantity}</strong>
                        </div>
                        <div className="checkout-summary-row">
                            <span>Subtotal</span>
                            <strong>
                                ₹{cartTotal.toLocaleString("en-IN")}
                            </strong>
                        </div>
                        <div className="checkout-summary-row">
                            <span>Delivery Charges</span>
                            <strong className="free-delivery">
                                FREE
                            </strong>
                        </div>
                        <div className="checkout-divider"></div>
                        <div className="checkout-grand-total">
                            <span>Grand Total</span>
                            <h2>
                                ₹{cartTotal.toLocaleString("en-IN")}
                            </h2>
                        </div>
                        <button
                            type="submit"
                            className="place-order-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Processing..."
                                : paymentMethod === "COD"
                                    ? "Place Order"
                                    : "Continue to Payment"
                            }
                        </button>
                        <p className="checkout-secure-note">
                            <FaLock />
                            Secure Checkout
                        </p>
                        <button
                            type="button"
                            className="back-to-cart"
                            onClick={() => navigate("/cart")}
                        >
                            <FaArrowLeft />
                            Back to Cart
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}
export default Checkout;
