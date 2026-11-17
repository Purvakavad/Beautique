import "./Footer.css";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYoutube
} from "react-icons/fa";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-box">
          <h2>Beautique</h2>
          <p>
            Enhance your natural beauty with our premium
            beauty products and services.
          </p>
          <div className="social-icons">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.x.com/" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
          </div>
        </div>
        <div className="footer-box">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/products">Products</a>
          <a href="/Categories">Categories</a>
        </div>
        <div className="footer-box">
          <h3>Customer Support</h3>
          <a href="/contact">Contact Us</a>
          <a>FAQ</a>
          <a>Shipping</a>
          <a>Returns</a>
          <a>Privacy Policy</a>
        </div>
        <div className="footer-box">
          <h3>Contact Us</h3>
          <p>📍 Ahmedabad, Gujarat, India</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ beautique@gmail.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © 2026 Beautique. All Rights Reserved. | Developed by <span>Purva Kavad</span>
        </p>
      </div>
    </footer>
  );
}
export default Footer;