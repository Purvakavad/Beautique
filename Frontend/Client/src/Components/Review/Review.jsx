import "./Review.css";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
function Review() {
  return (
    <section className="reviews">
      <div className="reviews-title">
        <h4>Customer Reviews</h4>
        <h2>What Our Customers Say</h2>
        <p>
          Our customers love Beautique and the beauty experience we provide.
        </p>
      </div>
      <div className="review-container">
        <div className="review-card">
          <FaQuoteLeft className="quote-icon" />
          <div className="review-stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <p className="review-text">
            "Amazing beauty products and excellent quality.
            I really loved the products from Beautique."
          </p>
          <div className="customer">
            <div className="customer-circle">P</div>
            <div>
              <h3>Priya Shah</h3>
              <span>Happy Customer</span>
            </div>
          </div>
        </div>
        <div className="review-card">
          <FaQuoteLeft className="quote-icon" />
          <div className="review-stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <p className="review-text">
            "The products are beautiful and premium.
            The skincare collection is my favourite."
          </p>
          <div className="customer">
            <div className="customer-circle">R</div>
            <div>
              <h3>Riya Patel</h3>
              <span>Happy Customer</span>
            </div>
          </div>
        </div>
        <div className="review-card">
          <FaQuoteLeft className="quote-icon" />
          <div className="review-stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
          <p className="review-text">
            "Beautique has everything I need for my beauty routine.
            Highly recommended for beauty lovers."
          </p>
          <div className="customer">
            <div className="customer-circle">A</div>
            <div>
              <h3>Anjali Mehta</h3>
              <span>Happy Customer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Review;