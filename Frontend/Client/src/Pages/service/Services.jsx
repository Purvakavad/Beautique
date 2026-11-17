import { useEffect, useState } from "react";
import axios from "axios";
import "./Services.css";
import { Link } from "react-router-dom";

const iconMap = {
  spa: "❀",
  heart: "♡",
  star: "✦",
  gem: "◇",
  crown: "♕",
  magic: "✧",
  sparkles: "✦",
  famagic: "✧",
  faheart: "♡",
  facut: "✂",
  fagem: "◇",
  fastar: "★",
  facrown: "♕",
};
function Services() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetchServices();
  }, []);
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/services/all`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const activeServices = response.data.services.filter(
          (service) => service.status === true
        );
        setServices(activeServices);
      }
    } catch (error) {
      console.log("Services Fetch Error:", error);
      setError("Unable to load services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedService) {
      document.getElementById("service-details")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedService]);
  const scrollToServices = () => {
    document.getElementById("services-cards")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const handleBack = () => {
    setSelectedService(null);
    setTimeout(() => {
      document.getElementById("services-cards")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };
  const getServiceIcon = (icon) => {
    if (!icon) return "✦";
    const iconName = String(icon).toLowerCase();
    return iconMap[iconName] || icon;
  };
  return (
    <>
      <section className="services-hero">
        <div className="services-hero-content">
          <h4>OUR SERVICES</h4>
          <h1>
            Beauty Services
            <span> Designed For You</span>
          </h1>
          <p>
            Discover our professional beauty services created to make you feel
            confident, refreshed and beautiful.
          </p>
          <button className="services-hero-btn" onClick={scrollToServices}>
            Explore Services <span>→</span>
          </button>
        </div>
      </section>
      <section className="services-list-section" id="services-cards">
        <div className="services-list-title">
          <h4>WHAT WE OFFER</h4>
          <h2>
            Our Beauty <span>Services</span>
          </h2>
          <p>
            Professional beauty services designed to help you look refreshed,
            feel confident and enjoy self-care.
          </p>
        </div>
        <div className="services-list-container">
          {loading ? (
            <p>Loading services...</p>
          ) : error ? (
            <p>{error}</p>
          ) : services.length === 0 ? (
            <p>No services available right now.</p>
          ) : (
            services.map((service, index) => (
              <div className="service-card" key={service._id}>
                <div className="service-icon">
                  {getServiceIcon(service.icon)}
                </div>
                <span className="service-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{service.title}</h3>
                <p>
                  {service.shortDescription || service.description}
                </p>
                <button onClick={() => setSelectedService(service)}>
                  Learn More →
                </button>
              </div>
            ))
          )}
        </div>
      </section>
      {selectedService && (
        <section
          className="service-details-section"
          id="service-details"
        >
          <div className="service-details-container">
            <button className="service-back-btn" onClick={handleBack}>
              ← Back to Services
            </button>
            <div className="service-details-header">
              <div className="service-details-icon">
                {getServiceIcon(selectedService.icon)}
              </div>
              <div>
                <span className="service-details-label">
                  BEAUTIQUE SERVICE
                </span>
                <h2>{selectedService.title}</h2>
                <p>
                  {selectedService.description ||
                    selectedService.shortDescription}
                </p>
              </div>
            </div>
            <div className="service-info-grid">
              <div className="service-info-box">
                <span>⏱</span>
                <h4>Duration</h4>
                <p>{selectedService.duration}</p>
              </div>
              <div className="service-info-box">
                <span>₹</span>
                <h4>Starting Price</h4>
                <p>
                  ₹{Number(selectedService.startingPrice).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="service-info-box">
                <span>★</span>
                <h4>Experience</h4>
                <p>{selectedService.experience}</p>
              </div>
            </div>
            <div className="service-benefits-details">
              <div className="details-left">
                <span className="details-small-title">
                  WHY CHOOSE THIS SERVICE
                </span>
                <h3>
                  What You <span>Get</span>
                </h3>
                <p>
                  Enjoy a premium beauty experience with professional care,
                  quality products and personalized attention.
                </p>
              </div>
              <div className="details-benefit-list">
                {selectedService.benefits?.map((benefit, index) => (
                  <div className="details-benefit-item" key={index}>
                    <span>✓</span>
                    <p>{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="service-booking-box">
              <div>
                <span>READY FOR YOUR BEAUTY EXPERIENCE?</span>
                <h3>Book Your Appointment</h3>
                <p>
                  Choose your preferred date and enjoy your Beautique
                  experience.
                </p>
              </div>
              <Link to="/booknow">
                <button className="details-book-btn">
                  Book Appointment →
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
      <section className="service-benefits-section">
        <div className="service-benefits-title">
          <h4>WHY CHOOSE OUR SERVICES</h4>
          <h2>
            Beauty Care With <span>Benefits</span>
          </h2>
          <p>
            We focus on quality, comfort and personalized care to make every
            beauty experience special.
          </p>
        </div>
        <div className="service-benefits-container">
          <div className="benefit-card">
            <div className="benefit-icon">✦</div>
            <h3>Professional Experts</h3>
            <p>
              Our beauty services are designed with professional care and
              attention to detail.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">♕</div>
            <h3>Premium Products</h3>
            <p>
              We use quality beauty products for a comfortable and premium
              experience.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">♡</div>
            <h3>Personalized Care</h3>
            <p>
              Every customer receives care designed around their individual
              beauty needs.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">❀</div>
            <h3>Relaxing Experience</h3>
            <p>
              Enjoy a peaceful beauty experience where you can relax and
              refresh.
            </p>
          </div>
        </div>
      </section>
      <section className="how-work-section">
        <div className="how-work-title">
          <h4>SIMPLE & EASY</h4>
          <h2>
            How It <span>Works</span>
          </h2>
          <p>Getting your favorite beauty service is simple.</p>
        </div>
        <div className="how-work-container">
          {[
            ["01", "Choose a Service", "Select the beauty service that matches your needs."],
            ["02", "Book Appointment", "Choose a convenient date and time."],
            ["03", "Beauty Consultation", "Our experts understand your needs."],
            ["04", "Enjoy Your Experience", "Relax and enjoy your personalized beauty experience."],
          ].map(([number, title, text]) => (
            <div className="work-step" key={number}>
              <div className="work-icon">{number}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="appointment-section">
        <div className="appointment-content">
          <div className="appointment-icon">♕</div>
          <h4>READY FOR YOUR BEAUTY EXPERIENCE?</h4>
          <h2>
            Your Beauty,<span> Your Time.</span>
          </h2>
          <p>
            Choose your favorite beauty service and book an appointment.
          </p>
          <div className="appointment-buttons">
            <Link to="/booknow">
              <button className="appointment-btn">
                Book Appointment
              </button>
            </Link>
            <button
              className="appointment-outline-btn"
              onClick={scrollToServices}
            >
              View Services
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
export default Services;
