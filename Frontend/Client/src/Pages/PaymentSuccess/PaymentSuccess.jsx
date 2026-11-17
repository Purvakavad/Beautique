import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaCheckCircle,
    FaClock,
    FaShoppingBag
} from "react-icons/fa";
import { ProductContext } from "../../Context/ProductContext";
import "../OrderSuccess/OrderSuccess.css";
const API = (
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
).replace(/\/+$/, "");
function PaymentSuccess() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const { setCartItems } = useContext(ProductContext);
    const params = new URLSearchParams(search);
    const orderId = params.get("order_id");
    const sessionId = params.get("session_id");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        if (!orderId || !sessionId) {
            setError("Payment details are missing.");
            setLoading(false);
            return;
        }
        let cancelled = false;
        let timer;
        let attempts = 0;
        const verifyPayment = async () => {
            attempts++;
            try {
                const response = await axios.post(
                    `${API}/api/order/stripe/verify-session`,
                    {
                        sessionId
                    },
                    {
                        withCredentials: true
                    }
                );
                if (cancelled) return;
                if (
                    response.data.success &&
                    response.data.verified &&
                    response.data.order
                ) {
                    setOrder(response.data.order);
                    // Clear frontend cart immediately
                    setCartItems([]);
                    setLoading(false);
                    return;
                }
                if (attempts < 5) {
                    timer = setTimeout(verifyPayment, 2000);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                if (cancelled) return;
                console.log(
                    "STRIPE PAYMENT VERIFY ERROR:",
                    err.response?.data || err.message
                );
                setError(
                    err.response?.data?.message ||
                    "Unable to verify payment."
                );
                setLoading(false);
            }
        };
        verifyPayment();
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [orderId, sessionId]);
    const isPaid = order?.paymentStatus === "PAID";
    return (
        <section className="success-page">
            <div className="success-card">
                {isPaid ? (
                    <FaCheckCircle className="success-icon" />
                ) : (
                    <FaClock className="success-icon" />
                )}
                <h1>
                    {isPaid
                        ? "Payment Successful!"
                        : loading
                            ? "Verifying Your Payment..."
                            : "Payment Status Pending"
                    }
                </h1>
                <p>
                    {isPaid
                        ? "Thank you for shopping with Beautique. Your payment has been confirmed."
                        : loading
                            ? "Please wait while we verify your payment."
                            : "Payment is not confirmed yet. Please check your order again."
                    }
                </p>
                {error && <p>{error}</p>}
                {order && (
                    <div className="success-details">
                        <p>
                            Order ID:
                            <strong>{order._id}</strong>
                        </p>
                        <p>
                            Payment Method:
                            <strong>{order.paymentMethod}</strong>
                        </p>
                        <p>
                            Payment Status:
                            <strong>{order.paymentStatus}</strong>
                        </p>
                        <p>
                            Order Status:
                            <strong>{order.orderStatus}</strong>
                        </p>
                        <p>
                            Total Amount:
                            <strong>
                                ₹{order.totalAmount?.toLocaleString("en-IN")}
                            </strong>
                        </p>
                    </div>
                )}
                <button onClick={() => navigate("/products")}>
                    <FaShoppingBag /> Continue Shopping
                </button>
            </div>
        </section>
    );
}
export default PaymentSuccess;
