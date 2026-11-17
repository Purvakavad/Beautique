import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  FaUsers,
  FaSearch,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaUserCircle,
  FaIdCard,
} from "react-icons/fa";
import "./Users.css";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/getAllUsers`,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || "Failed to load customers.");
      }
      setUsers(data.users || []);
      setTotalUsers(data.totalUsers || 0);
      setTotalCustomers(data.totalCustomers || 0);
    } catch (err) {
      console.error("Customers Error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load customers."
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  const formatDate = (date) => {
    if (!date) return "—";
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) return "—";
    return formattedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const formatTime = (date) => {
    if (!date) return "Never";
    const formattedDate = new Date(date);
    if (isNaN(formattedDate.getTime())) return "Never";
    return formattedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase().trim();
    if (!searchText) return true;
    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.phone?.toLowerCase().includes(searchText) ||
      user._id?.toLowerCase().includes(searchText)
    );
  });
  const getLoginStatus = (user) => {
    if (user.isOnline === true) {
      return {
        text: "Online",
        className: "customer-online",
      };
    }
    return {
      text: "Offline",
      className: "customer-offline",
    };
  };
  return (
    <div className="admin-customers-layout">
      <main className="admin-customers-main">
        <div className="admin-customers-page">
          <div className="customers-page-header">
            <div>
              <p className="customers-small-title">
                BEAUTIQUE ADMIN PANEL
              </p>
              <h1>Customers</h1>
              <p>
                Manage all registered Beautique customers.
              </p>
            </div>
          </div>
          {error && (
            <div className="customers-error">
              <span>{error}</span>
              <button onClick={() => setError("")}>
                ×
              </button>
            </div>
          )}
          <div className="customers-summary">
            <div className="customer-summary-card">
              <div className="customer-summary-icon">
                <FaUsers />
              </div>
              <div>
                <span>Total Users</span>
                <strong>{loading ? "..." : totalUsers}</strong>
              </div>
            </div>
            <div className="customer-summary-card">
              <div className="customer-summary-icon">
                <FaUserCircle />
              </div>
              <div>
                <span>Total Customers</span>
                <strong>{loading ? "..." : totalCustomers}</strong>
              </div>
            </div>
          </div>
          <div className="customers-toolbar">
            <div className="customers-search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by name, email, phone or customer ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {loading ? (
            <div className="customers-loading">
              <FaUsers />
              <p>Loading customers...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="customers-empty">
              <FaUsers />
              <h3>No Customers Found</h3>
              <p>
                Registered customers will appear here.
              </p>
            </div>
          ) : (
            <div className="customers-table-wrapper">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Customer ID</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Registration Date</th>
                    <th>Last Login</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const loginStatus = getLoginStatus(user);
                    return (
                      <tr key={user._id}>
                        <td>
                          <div className="customer-info">
                            <div className="customer-avatar">
                              {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            <div className="customer-name">
                              <strong>
                                {user.name || "Unknown User"}
                              </strong>
                              <span>Customer</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="customer-contact">
                            <FaIdCard />
                            <span title={user._id}>
                              {user._id || "—"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="customer-contact">
                            <FaEnvelope />
                            <span>{user.email || "—"}</span>
                          </div>
                        </td>
                        <td>
                          <div className="customer-contact">
                            <FaPhone />
                            <span>
                              {user.phone || "Not Provided"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="customer-date">
                            <FaCalendarAlt />
                            <span>{formatDate(user.createdAt)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="customer-date">
                            <FaClock />
                            <span>{formatTime(user.lastLogin)}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`customer-status ${loginStatus.className}`}
                          >
                            <span className="status-dot"></span>
                            {loginStatus.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default Users;
