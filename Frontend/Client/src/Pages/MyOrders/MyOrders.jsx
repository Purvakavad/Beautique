import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
    FaBoxOpen,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaCreditCard,
    FaShoppingBag,
    FaArrowRight
} from "react-icons/fa";
import "./MyOrders.css";
import { ProductContext } from "../../Context/ProductContext";
function MyOrders() {
    const { navigate } = useContext(ProductContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/order/my-orders`,
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setOrders(response.data.orders || []);
            }
        } catch (error) {
            console.log(
                "FETCH ORDERS ERROR:",
                error.response?.data || error.message
            );
            setError(
                error.response?.data?.message ||
                "Unable to load your orders. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);
    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };
    const formatPrice = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(amount || 0);
    };
    const getStatusClass = (status) => {
        return (status || "PROCESSING").toLowerCase();
    };
    return (
        <div className="my-orders-page">
            <section className="my-orders-hero">
                <div className="my-orders-hero-content">
                    <span>BEAUTIQUE COSMETICS</span>
                    <h1>My Orders</h1>
                    <p>
                        Your beauty essentials, all in one place.
                        Track your orders and stay updated.
                    </p>
                </div>
            </section>
            <section className="my-orders-container">
                <div className="my-orders-heading">
                    <div>
                        <span className="my-orders-subtitle">
                            YOUR SHOPPING HISTORY
                        </span>
                        <h2>Order History</h2>
                        <p>
                            View and track all your purchases.
                        </p>
                    </div>
                    {!loading && !error && (
                        <div className="my-orders-count">
                            <FaShoppingBag />
                            {orders.length} Orders
                        </div>
                    )}
                </div>
                {loading && (
                    <div className="my-orders-message">
                        <div className="orders-loader"></div>
                        <p>Loading your orders...</p>
                    </div>
                )}
                {!loading && error && (
                    <div className="my-orders-message">
                        <h3>Something went wrong</h3>
                        <p>{error}</p>
                        <button onClick={fetchOrders}>
                            Try Again
                        </button>
                    </div>
                )}
                {!loading && !error && orders.length === 0 && (
                    <div className="my-orders-empty">
                        <div className="empty-order-icon">
                            <FaBoxOpen />
                        </div>
                        <h2>No Orders Yet!</h2>
                        <p>
                            You haven't placed any orders yet.
                            Explore our collection and find
                            something you love.
                        </p>
                        <button
                            onClick={() => navigate("/products")}
                        >
                            Start Shopping
                            <FaArrowRight />
                        </button>
                    </div>
                )}
                {!loading && !error && orders.length > 0 && (
                    <div className="my-orders-list">
                        {orders.map((order) => (
                            <div
                                className="my-order-card"
                                key={order._id}
                            >
                                <div className="my-order-header">
                                    <div>
                                        <span>ORDER ID</span>
                                        <h3>
                                            #{order._id.slice(-8).toUpperCase()}
                                        </h3>
                                    </div>
                                    <span
                                        className={`order-status ${getStatusClass(order.orderStatus)}`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </div>
                                <div className="my-order-details">
                                    <div className="my-order-products">
                                        {order.items?.map((item, index) => (
                                            <div
                                                className="my-order-product"
                                                key={item._id || item.productId || index}
                                            >
                                                <div className="my-order-product-image">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                        />
                                                    ) : (
                                                        <FaShoppingBag />
                                                    )}
                                                </div>
                                                <div className="my-order-product-info">
                                                    <h4>{item.name}</h4>
                                                    <p>
                                                        Qty: {item.quantity}
                                                    </p>
                                                    <strong>
                                                        {formatPrice(item.price * item.quantity)}
                                                    </strong>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="my-order-summary">
                                        <div className="order-summary-item">
                                            <span>
                                                <FaCalendarAlt />
                                                Order Date
                                            </span>
                                            <strong>
                                                {formatDate(order.createdAt)}
                                            </strong>
                                        </div>
                                        <div className="order-summary-item">
                                            <span>
                                                <FaCreditCard />
                                                Payment
                                            </span>
                                            <strong>
                                                {order.paymentMethod}
                                            </strong>
                                        </div>
                                        <div className="order-summary-item">
                                            <span>
                                                Payment Status
                                            </span>
                                            <strong className={`payment-status ${getStatusClass(order.paymentStatus)}`}>
                                                {order.paymentStatus}
                                            </strong>
                                        </div>
                                        <div className="order-summary-item">
                                            <span>
                                                <FaMapMarkerAlt />
                                                Delivery City
                                            </span>
                                            <strong>
                                                {order.deliveryAddress?.city || "N/A"}
                                            </strong>
                                        </div>
                                        <div className="order-total">
                                            <span>Total Amount</span>
                                            <strong>
                                                {formatPrice(order.totalAmount)}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="my-order-footer">
                                    <span>
                                        {order.items?.length || 0} Product(s)
                                    </span>
                                    <span>
                                        Thank you for shopping with Beautique!
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
export default MyOrders;
