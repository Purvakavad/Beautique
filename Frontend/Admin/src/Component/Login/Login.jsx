import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import "./Login.css";
const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      if (!data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Admin Login Error:", err);
      setError(
        err.response?.data?.message ||
        "Cannot connect to server. Please make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        {/* =====================================
            LEFT SIDE
        ===================================== */}
        <div className="admin-login-left">
          <div className="admin-brand-icon">
            <FaUserShield />
          </div>
          <h1>Beautique</h1>
          <h2>Admin Panel</h2>
          <p>
            Manage your Beautique website from one
            beautiful and secure dashboard.
          </p>
        </div>
        {/* =====================================
            RIGHT SIDE LOGIN FORM
        ===================================== */}
        <div className="admin-login-right">
          <div className="login-heading">
            <h2>Admin Login</h2>
            <p>
              Sign in to access your dashboard
            </p>
          </div>
          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div className="admin-input-group">
              <label>Email Address</label>
              <div className="admin-input-box">
                <FaEnvelope />
                <input
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
            </div>
            {/* PASSWORD */}
            <div className="admin-input-group">
              <label>Password</label>
              <div className="admin-input-box">
                <FaLock />
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>
            </div>
            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>
          <div className="admin-login-footer">
            <span>Beautique Cosmetics</span>
            <span>Admin Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;