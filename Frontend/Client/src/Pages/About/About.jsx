import "./About.css";
import aboutImage from "../../assets/about.jpg";
import { Link } from "react-router-dom";
function About() {
  return (
    <>
      <section className="about-page">
        <div className="about-page-container">
          <div className="about-page-image">
            <img src={aboutImage} alt="Beautique Beauty" />
          </div>
          <div className="about-page-content">
            <h4>ABOUT BEAUTIQUE</h4>
            <h1>
              Your Beauty,
              <span> Our Passion</span>
            </h1>
            <p>
              Welcome to Beautique, your destination for premium
              beauty and skincare products.
            </p>
            <p>
              We believe that beauty is not just about appearance.
              It is about confidence, self-care and feeling your best
              every day.
            </p>
            <p>
              Our collection includes carefully selected makeup,
              skincare, perfumes, haircare and bodycare products
              designed to bring quality and elegance to your beauty
              routine.
            </p>
            <div className="about-points">
              <div>
                <strong>100+</strong>
                <span>Beauty Products</span>
              </div>
              <div>
                <strong>500+</strong>
                <span>Happy Customers</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Original Products</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mission-section">
        <div className="mission-heading">
          <span>OUR PURPOSE</span>
          <h2>
            What We <b>Believe</b>
          </h2>
          <p>
            Beauty is more than products. It is confidence, care and
            celebrating your unique beauty every day.
          </p>
        </div>
        <div className="mission-wrapper">
          <div className="purpose-card mission-card">
            <div className="purpose-top">
              <div className="purpose-icon">✦</div>
              <span className="purpose-number">01</span>
            </div>
            <h3>Our Mission</h3>
            <div className="gold-line"></div>
            <p>
              Our mission is to bring premium beauty and skincare products
              together in one elegant destination. We focus on quality,
              authenticity and products that make every customer feel
              confident and beautiful.
            </p>
            <div className="purpose-tag">
              QUALITY • CARE • CONFIDENCE
            </div>
          </div>
          <div className="purpose-card vision-card">
            <div className="purpose-top">
              <div className="purpose-icon">♡</div>
              <span className="purpose-number">02</span>
            </div>
            <h3>Our Vision</h3>
            <div className="gold-line"></div>
            <p>
              Our vision is to become a trusted beauty destination where
              customers discover premium products, enjoy an elegant
              shopping experience and find everything they need for
              their beauty journey.
            </p>
            <div className="purpose-tag">
              ELEGANCE • TRUST • BEAUTY
            </div>
          </div>
        </div>
      </section>
      <section className="journey-section">
        <div className="journey-title">
          <h4>OUR JOURNEY</h4>
          <h2>
            The Story Behind <span>Beautique</span>
          </h2>
          <p>
            From a simple idea to a trusted beauty destination,
            our journey is built on quality, passion and trust.
          </p>
        </div>
        <div className="journey-container">
          <div className="journey-card">
            <div className="journey-number">
              01
            </div>
            <h3>Our Beginning</h3>
            <p>
              Beautique started with a simple idea — to make premium
              beauty products easily available for everyone.
            </p>
          </div>
          <div className="journey-card">
            <div className="journey-number">
              02
            </div>
            <h3>Our Growth</h3>
            <p>
              With the love and trust of our customers, Beautique
              continues to grow with quality products and better service.
            </p>
          </div>
          <div className="journey-card">
            <div className="journey-number">
              03
            </div>
            <h3>Our Future</h3>
            <p>
              Our goal is to create a beautiful and trusted platform
              where everyone can discover products they truly love.
            </p>
          </div>
        </div>
      </section>
      <section className="philosophy-section">
        <div className="philosophy-title">
          <h4>OUR PHILOSOPHY</h4>
          <h2>
            Beauty With <span>Purpose</span>
          </h2>
          <p>
            At Beautique, we believe true beauty begins with
            confidence, care and choosing what makes you feel your best.
          </p>
        </div>
        <div className="philosophy-container">
          <div className="philosophy-card">
            <div className="philosophy-icon">
              ✦
            </div>
            <h3>Quality First</h3>
            <p>
              We carefully select beauty products with quality,
              authenticity and customer satisfaction in mind.
            </p>
          </div>
          <div className="philosophy-card">
            <div className="philosophy-icon">
              ♡
            </div>
            <h3>Beauty With Confidence</h3>
            <p>
              We believe beauty is about feeling confident,
              comfortable and happy with yourself.
            </p>
          </div>
          <div className="philosophy-card">
            <div className="philosophy-icon">
              ◆
            </div>
            <h3>Elegance & Care</h3>
            <p>
              Every part of our experience is designed with
              elegance, simplicity and genuine care.
            </p>
          </div>
        </div>
      </section>
      <section className="values-section">
        <div className="values-title">
          <h4>WHAT MATTERS TO US</h4>
          <h2>
            Our <span>Values</span>
          </h2>
          <p>
            Everything we do at Beautique is guided by values that
            help us create a better beauty experience.
          </p>
        </div>
        <div className="values-container">
          <div className="value-card">
            <div className="value-icon">
              ♡
            </div>
            <h3>Customer Happiness</h3>
            <p>
              Our customers are at the heart of everything we do.
              We always aim to create a happy and memorable experience.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              ✦
            </div>
            <h3>Authenticity</h3>
            <p>
              We believe in genuine products and honest service.
              Quality and trust are always our priority.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              ◆
            </div>
            <h3>Innovation</h3>
            <p>
              We continuously explore new beauty trends and products
              to keep your beauty journey fresh and exciting.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              ✿
            </div>
            <h3>Self-Care</h3>
            <p>
              We believe beauty should be a joyful part of self-care,
              confidence and feeling good every day.
            </p>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="team-title">
          <h4>OUR BEAUTY EXPERTS</h4>
          <h2>
            Meet Our <span>Team</span>
          </h2>
          <p>
            Meet the passionate people who work behind Beautique
            to create a beautiful and trusted experience.
          </p>
        </div>
        <div className="team-container">
          <div className="team-card">
            <div className="team-profile">
              A
            </div>
            <h3>Purva Kavad</h3>
            <span>Founder & CEO</span>
            <p>
              Leading Beautique with a passion for quality,
              beauty and customer satisfaction.
            </p>
            <div className="team-social">
              <a href="https://www.facebook.com/">f</a>
              <a href="https://www.linkedin.com/in/purvakavad/">in</a>
              <a href="https://www.instagram.com/">◎</a>
            </div>
          </div>
          <div className="team-card">
            <div className="team-profile">
              R
            </div>
            <h3>Aarav Mehta</h3>
            <span>Beauty Consultant</span>
            <p>
              Helping customers discover products that
              match their beauty needs and style.
            </p>
            <div className="team-social">
              <a href="https://www.facebook.com/">f</a>
              <a href="https://www.linkedin.com/">in</a>
              <a href="https://www.instagram.com/">◎</a>
            </div>
          </div>
          <div className="team-card">
            <div className="team-profile">
              N
            </div>
            <h3>Neha Patel</h3>
            <span>Product Specialist</span>
            <p>
              Selecting quality beauty products and keeping
              our collection fresh and reliable.
            </p>
            <div className="team-social">
              <a href="https://www.facebook.com/">f</a>
              <a href="https://www.linkedin.com/">in</a>
              <a href="https://www.instagram.com/">◎</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default About;