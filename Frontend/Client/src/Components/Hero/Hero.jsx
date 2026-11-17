import "./Hero.css";
import hero from "../../assets/hero.png";
import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-left">
        <h4>Welcome to Beautique</h4>
        <h1>
          Enhance Your <br />
          Natural Beauty
        </h1>
        <p>
          Discover premium skincare, makeup and beauty products
          crafted to make you feel confident every day.
        </p>
        <div className="hero-btns">
          <button
            className="shop-btn"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>
          <button
            className="book-btn"
            onClick={() => navigate("/booknow")}
          >
            Book Appointment
          </button>
        </div>
      </div>
      <div className="hero-right">
        <img src={hero} alt="Beauty" />
      </div>
    </section>
  );
}
export default Hero;