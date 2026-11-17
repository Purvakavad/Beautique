import { useContext } from "react";
import "./Categories.css";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import beauty_vedio from "../../assets/galleryimg/beauty_vedio.mp4";
import galleryHero from "../../assets/gallery.png";
import hair2Img from "../../assets/galleryimg/hair2.jpg";
import nail2Img from "../../assets/galleryimg/nail2.jpg";
import lipstick2Img from "../../assets/galleryimg/lipstick2.jpg";
import perfume2Img from "../../assets/galleryimg/perfume2.jpg";
import { ProductContext } from "../../Context/ProductContext";
function Categories() {
  const { categories } = useContext(ProductContext);
  const getCategoryIcon = (iconName) => {
    return FaIcons[iconName] || FaIcons.FaStar;
  };
  const getCategoryLink = (categoryName) => {
    return `/products?category=${encodeURIComponent(categoryName)}`;
  };
  return (
    <div className="gallery-page-main">
      <section className="gallery-lesson1-hero">
        <div className="gallery-lesson1-content">
          <div className="gallery-lesson1-small-title">
            <span></span>
            OUR GALLERY
            <span></span>
          </div>
          <h1>
            Beauty In
            <strong>Every Detail</strong>
          </h1>
          <p>
            Explore our world of beauty and elegance
            through moments that inspire and empower.
          </p>
        </div>
        <div className="gallery-lesson1-image-area">
          <div className="gallery-lesson1-leaf leaf-one">
            ❧
          </div>
          <div className="gallery-lesson1-leaf leaf-two">
            ❧
          </div>
          <div className="gallery-lesson1-circle">
            <img
              src={galleryHero}
              alt="Beauty Gallery"
            />
          </div>
          <div className="gallery-lesson1-badge">
            <span>GLOW</span>
            <span>INSPIRE</span>
            <span>BEAUTIFY</span>
            <b>♡</b>
          </div>
        </div>
      </section>
      <section className="gallery-lesson2-category">
        <Link to="/products?category=all">
          <button
            className="gallery-lesson2-item active"
            type="button"
          >
            <span>✦</span>
            ALL
          </button>
        </Link>

        {categories.map((category) => {
          const Icon = getCategoryIcon(category.icon);

          return (
            <Link
              to={getCategoryLink(category.name)}
              key={category._id}
            >
              <button
                className="gallery-lesson2-item"
                type="button"
              >
                <span>
                  <Icon />
                </span>
                {category.name?.toUpperCase()}
              </button>
            </Link>
          );
        })}
      </section>
      <section className="gallery-lesson3-collection">
        <div className="gallery-lesson3-heading">
          <h2>
            Our
            <span>Beauty</span>
            Collection
          </h2>
          <div className="gallery-lesson3-decoration">
            <span></span>
            <b>✦</b>
            <span></span>
          </div>
        </div>
        {categories.length === 0 ? (
          <p>No categories available.</p>
        ) : (
          <div className="gallery-lesson3-grid">
            {categories.length === 0 ? (
              <p>No categories available.</p>
            ) : (
              categories.map((category) => {
                const Icon = getCategoryIcon(category.icon);

                return (
                  <Link
                    to={getCategoryLink(category.name)}
                    className="gallery-lesson3-link"
                    key={category._id}
                  >
                    <div className="gallery-lesson3-card">
                      <div className="gallery-lesson3-image">
                        <img
                          src={category.image}
                          alt={category.name}
                        />
                      </div>

                      <div className="gallery-lesson3-info">
                        <div className="gallery-lesson3-icon">
                          <Icon />
                        </div>
                        <h3>{category.name}</h3>
                        <p>{category.shortDescription}</p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </section>
      <section className="gallery-lesson4-video-section">
        <div className="gallery-lesson4-video-box">
          <video
            className="gallery-lesson4-video"
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={beauty_vedio} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="gallery-lesson4-content">
          <p className="gallery-lesson4-small-title">
            FEATURED MOMENTS
          </p>
          <h2>
            Captured Beauty
            <br />
            Timeless
            <span>Moments</span>
          </h2>
          <p className="gallery-lesson4-description">
            Every moment has its own beauty. From getting
            ready to feeling confident, we capture the
            elegance, glow and the real you.
          </p>
          <div className="gallery-lesson4-small-images">
            <img
              src={hair2Img}
              alt="Hair Beauty"
            />
            <img
              src={nail2Img}
              alt="Nail Beauty"
            />
            <img
              src={lipstick2Img}
              alt="Makeup Beauty"
            />
            <img
              src={perfume2Img}
              alt="Perfume Beauty"
            />
          </div>
        </div>
      </section>
      <section className="gallery-lesson6-cta">
        <div className="gallery-lesson6-icon">
          <span>✦</span>
        </div>
        <div className="gallery-lesson6-content">
          <h2>
            Your Beauty,
            <span>Your Story</span>
          </h2>
          <p>
            Discover beauty that makes you feel confident,
            elegant and truly yourself.
          </p>
        </div>
        <div className="gallery-lesson6-button-area">
          <Link
            to="/products"
            style={{
              textDecoration: "none",
            }}
          >
            <button
              className="gallery-lesson6-button"
              type="button"
            >
              EXPLORE PRODUCTS
              <span>→</span>
            </button>
          </Link>
        </div>
        <div className="gallery-lesson6-leaf gallery-lesson6-leaf-left">
          ❧
        </div>
        <div className="gallery-lesson6-leaf gallery-lesson6-leaf-right">
          ❧
        </div>
      </section>
    </div>
  );
}
export default Categories;
