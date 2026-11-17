import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
    FaShoppingBag,
    FaClock,
    FaTruck,
    FaCheckCircle,
    FaTimesCircle,
    FaSearch,
    FaEye,
    FaFilter,
    FaCalendarAlt,
    FaCreditCard,
    FaUser,
    FaBox,
} from "react-icons/fa";
import "./Orders.css";
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [paymentFilter, setPaymentFilter] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        paidOrders: 0,
    });
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/order/all`,
                {
                    withCredentials: true,
                }
            );
            const data = response.data;
            if (!data.success) {
                throw new Error(data.message || "Unable to fetch orders");
            }
            setOrders(data.orders || []);
            setStats({
                totalOrders: data.totalOrders || 0,
                pendingOrders: data.pendingOrders || 0,
                processingOrders: data.processingOrders || 0,
                deliveredOrders: data.deliveredOrders || 0,
                cancelledOrders: data.cancelledOrders || 0,
                paidOrders: data.paidOrders || 0,
            });
        } catch (err) {
            console.error("Orders Error:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load orders."
            );
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    const formatDate = (date) => {
        if (!date) return "—";
        const value = new Date(date);
        if (isNaN(value.getTime())) return "—";
        return value.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const formatAmount = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };
    const getOrderStatus = (status) => {
        return (status || "PENDING").toLowerCase();
    };
    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setSelectedStatus(order.orderStatus || "PENDING");
    };
    const handleUpdateStatus = async () => {
        if (!selectedOrder || !selectedStatus) return;
        if (selectedStatus === selectedOrder.orderStatus) {
            return;
        }
        try {
            setUpdatingStatus(true);
            setError("");
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/order/status`,
                {
                    orderId: selectedOrder._id,
                    orderStatus: selectedStatus,
                },
                {
                    withCredentials: true,
                }
            );
            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Unable to update order status"
                );
            }
            const updatedOrder = {
                ...selectedOrder,
                orderStatus: selectedStatus,
            };
            setSelectedOrder(updatedOrder);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === selectedOrder._id
                        ? { ...order, orderStatus: selectedStatus }
                        : order
                )
            );
            await fetchOrders();
        } catch (err) {
            console.error("Update Order Status Error:", err);
            setError(
                err.response?.data?.message ||
                "Failed to update order status."
            );
        } finally {
            setUpdatingStatus(false);
        }
    };
    const filteredOrders = orders.filter((order) => {
        const customerName = order.userId?.name || order.name || "";
        const customerEmail = order.userId?.email || "";
        const matchesSearch =
            order._id?.toLowerCase().includes(search.toLowerCase()) ||
            customerName.toLowerCase().includes(search.toLowerCase()) ||
            customerEmail.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "All" ||
            order.orderStatus === statusFilter.toUpperCase();
        const matchesPayment =
            paymentFilter === "All" ||
            order.paymentMethod === paymentFilter;
        return matchesSearch && matchesStatus && matchesPayment;
    });
    return (
        <div className="all-orders-page">
            <div className="orders-header">
                <div>
                    <span className="orders-eyebrow">
                        BEAUTIQUE ADMIN PANEL
                    </span>
                    <h1>All Orders</h1>
                    <p>Manage and track all customer orders.</p>
                </div>
                <div className="orders-header-icon">
                    <FaShoppingBag />
                </div>
            </div>
            {error && (
                <div className="orders-error">
                    {error}
                </div>
            )}
            <div className="orders-stats">
                <div className="order-stat-card">
                    <div className="order-stat-icon purple">
                        <FaShoppingBag />
                    </div>
                    <div>
                        <span>Total Orders</span>
                        <h2>{loading ? "..." : stats.totalOrders}</h2>
                    </div>
                </div>
                <div className="order-stat-card">
                    <div className="order-stat-icon green">
                        <FaCreditCard />
                    </div>
                    <div>
                        <span>Paid Orders</span>
                        <h2>
                            {loading ? "..." : stats.paidOrders}
                        </h2>
                    </div>
                </div>
                <div className="order-stat-card">
                    <div className="order-stat-icon blue">
                        <FaTruck />
                    </div>
                    <div>
                        <span>Processing</span>
                        <h2>{loading ? "..." : stats.processingOrders}</h2>
                    </div>
                </div>
                <div className="order-stat-card">
                    <div className="order-stat-icon green">
                        <FaCheckCircle />
                    </div>
                    <div>
                        <span>Delivered</span>
                        <h2>{loading ? "..." : stats.deliveredOrders}</h2>
                    </div>
                </div>
                <div className="order-stat-card">
                    <div className="order-stat-icon red">
                        <FaTimesCircle />
                    </div>
                    <div>
                        <span>Cancelled</span>
                        <h2>{loading ? "..." : stats.cancelledOrders}</h2>
                    </div>
                </div>
            </div>
            <div className="orders-filter-section">
                <div className="orders-search">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search Order ID, customer name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="orders-filter">
                    <FaFilter />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Confirmed">Confirmed</option>
                    </select>
                </div>
                <div className="orders-filter">
                    <FaCreditCard />
                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                        <option value="All">All Payments</option>
                        <option value="COD">COD</option>
                        <option value="Stripe">Stripe</option>
                        <option value="RAZORPAY">Razorpay</option>
                    </select>
                </div>
            </div>
            <div className="orders-table-container">
                {loading ? (
                    <div className="orders-empty">
                        <FaShoppingBag />
                        <p>Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="orders-empty">
                        <FaBox />
                        <h3>No Orders Found</h3>
                        <p>There are no orders matching your search.</p>
                    </div>
                ) : (
                    <table className="all-orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => {
                                const customerName =
                                    order.userId?.name || order.name || "Customer";
                                const itemCount =
                                    order.items?.reduce(
                                        (total, item) => total + (item.quantity || 1),
                                        0
                                    ) || 0;
                                return (
                                    <tr key={order._id}>
                                        <td>
                                            <strong className="order-id">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </strong>
                                        </td>
                                        <td>
                                            <div className="order-customer">
                                                <div className="order-customer-avatar">
                                                    <FaUser />
                                                </div>
                                                <div>
                                                    <strong>{customerName}</strong>
                                                    <span>
                                                        {order.userId?.email || "—"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="order-date">
                                                <FaCalendarAlt />
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </td>
                                        <td>{itemCount}</td>
                                        <td>
                                            <strong>
                                                {formatAmount(order.totalAmount)}
                                            </strong>
                                        </td>
                                        <td>
                                            <span className="payment-method">
                                                {order.paymentMethod || "—"}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`order-status ${getOrderStatus(order.orderStatus)}`}
                                            >
                                                {order.orderStatus || "Pending"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="order-view-btn"
                                                onClick={() => openOrderDetails(order)}
                                                title="View Order"
                                            >
                                                <FaEye />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
            {selectedOrder && (
                <div
                    className="order-modal-overlay"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="order-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="order-modal-header">
                            <div>
                                <span>ORDER DETAILS</span>
                                <h2>
                                    #{selectedOrder._id.slice(-8).toUpperCase()}
                                </h2>
                            </div>
                            <button onClick={() => setSelectedOrder(null)}>
                                ×
                            </button>
                        </div>
                        <div className="order-modal-content">
                            <h3>Customer Information</h3>
                            <p>
                                <strong>Name:</strong>{" "}
                                {selectedOrder.userId?.name || selectedOrder.name || "—"}
                            </p>
                            <p>
                                <strong>Email:</strong>{" "}
                                {selectedOrder.userId?.email || "—"}
                            </p>
                            <p>
                                <strong>Phone:</strong>{" "}
                                {selectedOrder.userId?.phone || "—"}
                            </p>
                            <h3>Order Information</h3>
                            <p>
                                <strong>Order Date:</strong>{" "}
                                {formatDate(selectedOrder.createdAt)}
                            </p>
                            <p>
                                <strong>Payment Method:</strong>{" "}
                                {selectedOrder.paymentMethod || "—"}
                            </p>
                            <p>
                                <strong>Payment Status:</strong>{" "}
                                {selectedOrder.paymentStatus || "—"}
                            </p>
                            <p>
                                <strong>Order Status:</strong>{" "}
                                {selectedOrder.orderStatus || "PENDING"}
                            </p>
                            <p>
                                <strong>Total Amount:</strong>{" "}
                                {formatAmount(selectedOrder.totalAmount)}
                            </p>
                            <h3>Update Order Status</h3>
                            <p>
                                <strong>Current Status:</strong>{" "}
                                {selectedOrder.orderStatus || "PENDING"}
                            </p>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                disabled={updatingStatus}
                            >
                                <option value="PROCESSING">Processing</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleUpdateStatus}
                                disabled={
                                    updatingStatus ||
                                    selectedStatus === selectedOrder.orderStatus
                                }
                            >
                                {updatingStatus ? "Updating..." : "Update Status"}
                            </button>
                            <h3>Order Items</h3>
                            {selectedOrder.items?.map((item, index) => (
                                <div className="order-modal-item" key={item._id || index}>
                                    <span>
                                        {item.name || item.productName || "Product"}
                                    </span>
                                    <strong>
                                        Qty: {item.quantity || 1}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Orders;
