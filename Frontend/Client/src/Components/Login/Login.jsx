import { useState } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useContext } from "react";
import { ProductContext } from "../../Context/ProductContext";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(ProductContext)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password },
        {
          withCredentials: true
        }
      );
      if (response.data.success) {
        setUser(response.data.user);
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          B
        </div>
        <span className="auth-small">
          BEAUTIQUE COSMETICS
        </span>
        <h1>
          Welcome Back
        </h1>
        <p>
          Login to your Beautique account.
        </p>
        <form onSubmit={handleLogin}>
          <div className="auth-input-group">
            <FaEnvelope />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="auth-input-group">
            <FaLock />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <button
            type="submit"
            className="auth-main-btn"
            disabled={loading}
          >
            {loading
              ? "Logging In..."
              : "Login"
            }
            {!loading && (
              <FaArrowRight />
            )}
          </button>
        </form>
        <div className="auth-bottom-text">
          Don't have an account?
          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
          >
            Create Account
          </button>
        </div>
        <button
          type="button"
          className="auth-admin-link"
          onClick={() =>
            window.location.href = "https://beautique-admin.onrender.com/"
          }
        >
          <FaUser />
          Admin Login
        </button>
      </div>
    </div>
  );
}
export default Login;