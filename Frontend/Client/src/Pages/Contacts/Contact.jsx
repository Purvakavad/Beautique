import { useState } from "react";
import "./Contact.css";
import axios from "axios"
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setSubmitted(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }
    if (!formData.message.trim()) {
      alert("Please enter your message.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/contacts`,
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          message: formData.message.trim(),
        }
      );
      if (response.data.success) {
        setSubmitted(true);
        alert("Your message has been sent successfully!");
        setFormData({
          name: "",
          email: "",
          message: "",
        });
        setTimeout(() => {
          setSubmitted(false);
        }, 4000);
      }
    } catch (error) {
      console.error("Contact Submission Error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to send your message."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="contact-page">
      <div className="contact-container">
        <div className="contact-info">
          <span className="contact-small-title">
            CONTACT BEAUTIQUE
          </span>
          <h1>
            Get In <strong>Touch</strong>
          </h1>
          <p>
            Have a question or need help?
            Send us a message and our team
            will get back to you soon.
          </p>
          <div className="contact-info-box">
            <div className="contact-info-icon">
              ✉
            </div>
            <div>
              <strong>Email</strong>
              <span>
                beautique@gmail.com
              </span>
            </div>
          </div>
          <div className="contact-info-box">
            <div className="contact-info-icon">
              ☎
            </div>
            <div>
              <strong>Phone</strong>
              <span>
                +91 98765 43210
              </span>
            </div>
          </div>
          <div className="contact-info-box">
            <div className="contact-info-icon">
              📍
            </div>
            <div>
              <strong>Address</strong>
              <span>
                Ahmedabad, Gujarat, India
              </span>
            </div>
          </div>
        </div>
        <div className="contact-form-card">
          <span className="contact-form-label">
            SEND MESSAGE
          </span>
          <h2>
            We'd love to hear from you
          </h2>
          {submitted && (
            <div className="contact-success">
              ✓ Message sent successfully!
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="contact-form-group">
              <label>
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="contact-form-group">
              <label>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="contact-form-group">
              <label>
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                rows="6"
              />
            </div>
            <button
              type="submit"
              className="contact-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Message →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
export default Contact;