import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaUsers,
  FaCalendarAlt,
  FaEnvelope,
  FaHeart,
  FaArrowRight,
  FaGem,
  FaTags,
  FaShoppingBag,
} from "react-icons/fa";
import axios from "axios";
import "./Dashboard.css";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    registeredUsers: 0,
    appointments: 0,
    contactEnquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("adminToken");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!data.success) {
        throw new Error(
          data.message || "Failed to load dashboard statistics."
        );
      }
      setStats({
        totalProducts: data.stats.totalProducts || 0,
        registeredUsers: data.stats.registeredUsers || 0,
        appointments: data.stats.appointments || 0,
        contactEnquiries: data.stats.contactEnquiries || 0,
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to connect with Beautique backend."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <FaBoxOpen />,
      className: "products-card",
      description: "Available beauty products",
    },
    {
      title: "Registered Users",
      value: stats.registeredUsers,
      icon: <FaUsers />,
      className: "users-card",
      description: "Your customer community",
    },
    {
      title: "Appointments",
      value: stats.appointments,
      icon: <FaCalendarAlt />,
      className: "appointments-card",
      description: "Total bookings received",
    },
    {
      title: "Contact Enquiries",
      value: stats.contactEnquiries,
      icon: <FaEnvelope />,
      className: "contact-card",
      description: "Messages from customers",
    },
  ];
  let adminName = "Admin";
  try {
    const adminInfo = JSON.parse(
      localStorage.getItem("adminInfo")
    );
    if (adminInfo?.name) {
      adminName = adminInfo.name;
    }
  } catch {
    adminName = "Admin";
  }
  return (
    <div className="admin-layout">
      <main className="admin-main-content">
        <div className="admin-dashboard">
          {/* DASHBOARD HEADER */}
          <div className="dashboard-header">
            <div className="dashboard-header-left">
              <p className="dashboard-small-title">
                BEAUTIQUE ADMIN PANEL
              </p>
              <h1>Dashboard</h1>
              <p className="dashboard-subtitle">
                Welcome back, {adminName}! Manage your beauty
                store and keep everything running smoothly.
              </p>
            </div>
          </div>
          {/* WELCOME BANNER */}
          <section className="dashboard-welcome-banner">
            <div className="welcome-banner-content">
              <span className="welcome-tag">
                <FaHeart /> BEAUTY & CARE
              </span>
              <h2>
                Your Beauty Business,
                <br />
                All in One Place.
              </h2>
              <p>
                Keep track of your products, customers,
                appointments and enquiries from one simple
                dashboard.
              </p>
            </div>
            <div className="welcome-banner-decoration">
              <FaGem />
            </div>
          </section>
          {/* ERROR */}
          {error && (
            <div className="dashboard-error">
              <strong>Unable to load dashboard statistics</strong>
              <p>{error}</p>
            </div>
          )}
          {/* BUSINESS OVERVIEW */}
          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <span className="section-eyebrow">
                  YOUR BUSINESS
                </span>
                <h2>Business Overview</h2>
                <p>
                  A quick look at your Beautique website.
                </p>
              </div>
            </div>
            <div className="dashboard-cards">
              {cards.map((card) => (
                <div
                  className={`dashboard-card ${card.className}`}
                  key={card.title}
                >
                  <div className="card-top">
                    <div className="card-icon">
                      {card.icon}
                    </div>
                    <span className="card-status-dot"></span>
                  </div>
                  <div className="card-content">
                    <p className="card-title">
                      {card.title}
                    </p>
                    <h2>
                      {loading
                        ? "..."
                        : card.value.toLocaleString("en-IN")}
                    </h2>
                    <span className="card-description">
                      {card.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* WEBSITE MANAGEMENT */}
          <section className="dashboard-management">
            <div className="dashboard-section-heading">
              <div>
                <span className="section-eyebrow">
                  ADMIN WORKSPACE
                </span>
                <h2>Manage Your Website</h2>
                <p>
                  Everything you need to manage your Beautique
                  website in one place.
                </p>
              </div>
            </div>
            <div className="dashboard-management-grid">
              {/* PRODUCT MANAGEMENT */}
              <div
                className="management-card management-products"
                onClick={() => navigate("/products")}
              >
                <div className="management-card-icon">
                  <FaBoxOpen />
                </div>
                <div className="management-card-content">
                  <h3>Product Management</h3>
                  <p>
                    Add new beauty products, update details and
                    manage your product collection.
                  </p>
                </div>
                <div className="management-card-arrow">
                  <FaArrowRight />
                </div>
              </div>
              {/* CATEGORY MANAGEMENT */}
              <div
                className="management-card management-categories"
                onClick={() => navigate("/categories")}
              >
                <div className="management-card-icon">
                  <FaTags />
                </div>
                <div className="management-card-content">
                  <h3>Category Management</h3>
                  <p>
                    Add, update and manage your beauty product
                    categories.
                  </p>
                </div>
                <div className="management-card-arrow">
                  <FaArrowRight />
                </div>
              </div>
              {/* CUSTOMER MANAGEMENT */}
              <div
                className="management-card management-users"
                onClick={() => navigate("/users")}
              >
                <div className="management-card-icon">
                  <FaUsers />
                </div>
                <div className="management-card-content">
                  <h3>Customer Management</h3>
                  <p>
                    View registered customers and keep track of
                    your growing community.
                  </p>
                </div>
                <div className="management-card-arrow">
                  <FaArrowRight />
                </div>
              </div>
              {/* APPOINTMENT MANAGEMENT */}
              <div
                className="management-card management-appointments"
                onClick={() => navigate("/appointments")}
              >
                <div className="management-card-icon">
                  <FaCalendarAlt />
                </div>
                <div className="management-card-content">
                  <h3>Appointment Management</h3>
                  <p>
                    Review customer bookings and manage
                    appointment status.
                  </p>
                </div>
                <div className="management-card-arrow">
                  <FaArrowRight />
                </div>
              </div>
              {/* CUSTOMER ENQUIRIES */}
              <div
                className="management-card management-enquiries"
                onClick={() => navigate("/contact")}
              >
                <div className="management-card-icon">
                  <FaEnvelope />
                </div>
                <div className="management-card-content">
                  <h3>Customer Enquiries</h3>
                  <p>
                    Stay updated with customer questions and
                    contact messages.
                  </p>
                </div>
                <div className="management-card-arrow">
                  <FaArrowRight />
                </div>
              </div>
              {/* ORDER MANAGEMENT */}
              <div
                className="management-card management-orders"
                onClick={() => navigate("/orders")}
              >
                <div className="management-card-icon">
                  <FaShoppingBag />
                </div>
                <div className="management-card-content">
                  <h3>Order Management</h3>
                  <p>
                    View customer orders and manage order
                    processing and delivery status.
                  </p>
                </div>
                <div className="management-card-arrow">
                  <FaArrowRight />
                </div>
              </div>
            </div>
          </section>
          {/* FOOTER BANNER */}
          <section className="dashboard-footer-banner">
            <div className="footer-banner-icon">
              <FaHeart />
            </div>
            <div>
              <h3>Thank you for choosing Beautique!</h3>
              <p>
                Making beauty and care management simpler,
                every day.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;
