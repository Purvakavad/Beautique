
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaCalendarAlt,
  FaEnvelope,
  FaImages,
  FaSpa,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

import axios from "axios";
import "./Sidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // CLOSE SIDEBAR
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      setSidebarOpen(false);
      navigate("/login", { replace: true });

    } catch (error) {
      console.error("Admin Logout Error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >

        {/* LOGO */}
        <div className="sidebar-logo">

          <div className="sidebar-logo-icon">
            B
          </div>

          <div>
            <h2>Beautique</h2>
            <span>Admin Panel</span>
          </div>

          {/* MOBILE CLOSE BUTTON */}
          <button
            className="sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>

        </div>

        {/* NAVIGATION */}
        <nav className="sidebar-menu">

          <NavLink
            to="/"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/products"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FaBoxOpen />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/users"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FaUsers />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/categories"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FaImages />
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/orders"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FaCalendarAlt />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/services"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FaSpa />
            <span>Services</span>
          </NavLink>

          <NavLink
            to="/appointments"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FaCalendarAlt />
            <span>Appointments</span>
          </NavLink>

          <NavLink
            to="/contact"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <FaEnvelope />
            <span>Contact Enquiries</span>
          </NavLink>

        </nav>

        {/* LOGOUT */}
        <div className="sidebar-bottom">

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;
