import "./Booknow.css";
import bookNowBg from "../../assets/bhero.jpeg";
import axios from "axios";
import { useState, useContext } from "react";
import { ProductContext } from "../../Context/ProductContext";
function Booknow() {
  const { user, navigate } = useContext(ProductContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSubmitted(false);
  };
  const handleSubmit = async (e) => {
    if (!user) {
      alert("Please login first to book an appointment.");
      navigate("/login");
      return;
    }
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.service ||
      !formData.date ||
      !formData.time
    ) {
      alert("Please fill all the fields.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/appointments`,
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          service: formData.service,
          date: formData.date,
          time: formData.time,
        }, {
        withCredentials: true
      }
      );
      const data = response.data;
      if (!data.success) {
        alert(data.message || "Failed to book appointment.");
        return;
      }
      setSubmitted(true);
      alert("Your appointment has been booked successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: "",
        time: "",
      });
    } catch (error) {
      console.error(
        "Appointment Booking Error:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
        "Cannot connect to server. Please make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="booknow-page">
      <section
        className="booknow-hero"
        style={{
          backgroundImage: `url(${bookNowBg})`,
        }}
      >
        <div className="booknow-overlay"></div>
        <div className="booknow-hero-content">
          <p className="booknow-small-title">
            YOUR BEAUTY JOURNEY
          </p>
          <h1>
            Book Your
            <br />
            <span>Beauty Moment</span>
          </h1>
          <p className="booknow-description">
            Take a little time for yourself. Choose your
            favorite beauty service and let us create an
            experience made especially for you.
          </p>
          <div className="booknow-steps">
            <div className="booknow-step">
              <strong>01</strong>
              <span>Choose Service</span>
            </div>
            <div className="booknow-step-line"></div>
            <div className="booknow-step">
              <strong>02</strong>
              <span>Select Date</span>
            </div>
            <div className="booknow-step-line"></div>
            <div className="booknow-step">
              <strong>03</strong>
              <span>Book Your Moment</span>
            </div>
          </div>
        </div>
      </section>
      <section className="booking-section">
        <div className="booking-heading">
          <p>MAKE AN APPOINTMENT</p>
          <h2>
            Reserve Your
            <span> Beauty Experience</span>
          </h2>
          <div className="booking-line"></div>
        </div>
        <div className="booking-container">
          <div className="booking-info">
            <p className="booking-info-small">
              BEAUTIQUE
            </p>
            <h3>
              A little time
              <br />
              <span>just for you.</span>
            </h3>
            <p>
              Whether you are getting ready for a special
              occasion or simply want to enjoy some
              self-care, we are here to make your beauty
              experience memorable.
            </p>
            <div className="booking-info-item">
              <span className="booking-number">
                01
              </span>
              <div>
                <h4>Premium Experience</h4>
                <p>
                  Personalized beauty services designed
                  for you.
                </p>
              </div>
            </div>
            <div className="booking-info-item">
              <span className="booking-number">
                02
              </span>
              <div>
                <h4>Professional Care</h4>
                <p>
                  Our team focuses on every little detail.
                </p>
              </div>
            </div>
            <div className="booking-info-item">
              <span className="booking-number">
                03
              </span>
              <div>
                <h4>Your Beauty, Your Way</h4>
                <p>
                  Choose a service that makes you feel
                  confident.
                </p>
              </div>
            </div>
          </div>
          <div className="booking-form-box">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Select Service</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option value="">
                      Choose a service
                    </option>
                    <option value="Makeup">
                      Makeup
                    </option>
                    <option value="Skincare">
                      Skincare
                    </option>
                    <option value="Haircare">
                      Haircare
                    </option>
                    <option value="Nail Care">
                      Nail Care
                    </option>
                    <option value="Body Care">
                      Body Care
                    </option>
                    <option value="Beauty Consultation">
                      Beauty Consultation
                    </option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Select Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Select Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="booking-submit"
                disabled={loading}
              >
                {loading
                  ? "Booking..."
                  : "Confirm Appointment"}
                {!loading && (
                  <span> → </span>
                )}
              </button>
              {submitted && (
                <div className="success-message">
                  ✓ Your appointment request has been
                  submitted successfully!
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
export default Booknow;