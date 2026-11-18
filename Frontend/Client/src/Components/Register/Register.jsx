import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUserPlus,
} from "react-icons/fa";
import "./Register.css";
import axios from "axios";
const Register = () => {
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const focusField = (fieldRef) => {
    if (fieldRef.current) {
      fieldRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(() => {
        fieldRef.current?.focus();
      }, 400);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setMessage("");
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
    } = formData;
    if (!name.trim()) {
      setError("Please enter your full name.");
      focusField(nameRef);
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      focusField(emailRef);
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      focusField(passwordRef);
      return;
    }
    if (!confirmPassword) {
      setError("Please confirm your password.");
      focusField(confirmPasswordRef);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      focusField(confirmPasswordRef);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      focusField(passwordRef);
      return;
    }
    try {
      setLoading(true);
      const userData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        userData
      );
      const data = response.data;
      if (!data.success) {
        setError(data.message || "Registration failed.");
        scrollToTop();
        return;
      }
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(
        "Register Error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
      scrollToTop();
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <div className="register-icon">
            <FaUserPlus />
          </div>
          <h1>Beautique</h1>
          <h2>Create Your Account</h2>
          <p>
            Join Beautique and discover premium
            beauty products made for you.
          </p>
          <div className="register-benefits">
            <div>✓ Discover premium beauty products</div>
            <div>✓ Save your favorite products</div>
            <div>✓ Easy and secure shopping</div>
            <div>✓ Book beauty appointments</div>
          </div>
        </div>
        <div className="register-right">
          <div className="register-heading">
            <h2>Create Account</h2>
            <p>
              Register as a Beautique customer
            </p>
          </div>
          {message && (
            <div className="register-success">
              {message}
            </div>
          )}
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister}>
            <div className="register-input-group">
              <label>
                Full Name <span>*</span>
              </label>
              <div className="register-input-box">
                <FaUser />
                <input
                  ref={nameRef}
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="register-input-group">
              <label>
                Email Address <span>*</span>
              </label>
              <div className="register-input-box">
                <FaEnvelope />
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="register-input-group">
              <label>
                Phone Number
              </label>
              <div className="register-input-box">
                <FaPhone />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="register-input-group">
              <label>
                Password <span>*</span>
              </label>
              <div className="register-input-box">
                <FaLock />
                <input
                  ref={passwordRef}
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="register-input-group">
              <label>
                Confirm Password <span>*</span>
              </label>
              <div className="register-input-box">
                <FaLock />
                <input
                  ref={confirmPasswordRef}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>
          <div className="register-login-link">
            <span>
              Already have an account?
            </span>
            <Link to="/login">
              Login
            </Link>
          </div>
          <div className="register-footer">
            Beautique Cosmetics
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
