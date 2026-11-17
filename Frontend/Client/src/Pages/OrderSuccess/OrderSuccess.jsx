import { useLocation } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import "./OrderSuccess.css";
import { useContext } from "react";
import { ProductContext } from "../../Context/ProductContext";
function OrderSuccess() {
    const { state } = useLocation();
    const { navigate } = useContext(ProductContext);
    const order = state?.order;
    if (!order) {
        return (
            <div className="success-page">
                <h2>Order details not available</h2>
                <button onClick={() => navigate("/products")}>
                    Continue Shopping
                </button>
            </div>
        );
    }
    return (
        <section className="success-page">
            <div className="success-card">
                <FaCheckCircle className="success-icon" />
                <h1>Order Placed Successfully!</h1>
                <p>
                    Thank you for shopping with Beautique.
                    Your order has been received.
                </p>
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
                        Total Amount:
                        <strong>
                            ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </strong>
                    </p>
                </div>
                <button onClick={() => navigate("/products")}>
                    <FaShoppingBag /> Continue Shopping
                </button>
            </div>
        </section>
    );
}
export default OrderSuccess;
