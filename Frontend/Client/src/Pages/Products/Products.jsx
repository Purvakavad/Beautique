import "./Products.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ProductContext } from "../../Context/ProductContext";
import axios from "axios";
import * as FaIcons from "react-icons/fa";
import makeups from "../../assets/categori/mackup.jpg";
import skincares from "../../assets/categori/skincare.png";
import perfumes from "../../assets/categori/perfume.png";
import haircares from "../../assets/categori/haircare.jpg";
function Products() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [addingProduct, setAddingProduct] = useState(null);
  const { fetchCart, categories, navigate } = useContext(ProductContext);
  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/Product/getFeaturedProducts`
      );
      if (response.data.success) {
        setFeaturedProducts(response.data.products || []);
      }
    } catch (error) {
      console.log(
        "Featured Products Error:",
        error.response?.data || error.message
      );
    } finally {
      setFeaturedLoading(false);
    }
  };
  const getCategoryIcon = (iconName) => {
    if (!iconName) return <FaIcons.FaStar />;
    const formattedName =
      iconName.startsWith("Fa")
        ? iconName
        : `Fa${iconName.charAt(0).toUpperCase()}${iconName.slice(1)}`;
    const IconComponent = FaIcons[formattedName];
    return IconComponent
      ? <IconComponent />
      : <FaIcons.FaStar />;
  };
  const getCategoryLink = (categoryName) => {
    return `/products?category=${encodeURIComponent(categoryName)}`;
  };
  const getCategoryClass = (categoryName) => {
    const name = categoryName?.toLowerCase().trim();
    const categoryClasses = {
      makeup: "makeup-category",
      skincare: "skincare-category",
      perfume: "perfume-category",
      perfumes: "perfume-category",
      fragrance: "perfume-category",
      haircare: "hair-category",
      "hair care": "hair-category",
      bodycare: "body-category",
      "body care": "body-category",
      nailcare: "nail-category",
      "nail care": "nail-category",
    };
    return categoryClasses[name] || "makeup-category";
  };
  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAddingProduct(productId);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
        { productId },
        { withCredentials: true }
      );
      if (response.data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.log(
        "Add To Cart Error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        alert("Please login first to add products to cart.");
        navigate("/login");
        return;
      }
      alert(
        error.response?.data?.message ||
        "Unable to add product to cart."
      );
    } finally {
      setAddingProduct(null);
    }
  };
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);
  return (
    <>
      <section className="products-hero">
        <div className="hero-glow glow-one"></div>
        <div className="hero-glow glow-two"></div>
        <div className="products-hero-left">
          <div className="collection-tag">
            <span>✦</span> BEAUTIQUE EXCLUSIVE
          </div>
          <h1>
            Beauty
            <br />
            <span>Made Beautiful.</span>
          </h1>
          <p>
            Discover our luxurious collection of makeup, skincare,
            fragrance and self-care essentials curated specially for you.
          </p>
          <div className="hero-mini-stats">
            <div>
              <strong>150+</strong>
              <span>Beauty Products</span>
            </div>
            <div className="stat-line"></div>
            <div>
              <strong>25+</strong>
              <span>Premium Brands</span>
            </div>
            <div className="stat-line"></div>
            <div>
              <strong>100%</strong>
              <span>Authentic</span>
            </div>
          </div>
        </div>
        <div className="products-hero-right">
          <div className="main-beauty-circle">
            <div className="circle-inner">
              <div className="circle-text">BEAUTIQUE</div>
              <div className="circle-title">BEAUTY</div>
              <div className="circle-subtitle">COLLECTION</div>
            </div>
          </div>
          <div className="beauty-card card-makeup">
            <div className="beauty-icon makeup-icon">♡</div>
            <div>
              <strong>Makeup</strong>
              <span>40+ Products</span>
            </div>
          </div>
          <div className="beauty-card card-skincare">
            <div className="beauty-icon skincare-icon">✦</div>
            <div>
              <strong>Skincare</strong>
              <span>35+ Products</span>
            </div>
          </div>
          <div className="beauty-card card-perfume">
            <div className="beauty-icon perfume-icon">♢</div>
            <div>
              <strong>Fragrance</strong>
              <span>25+ Products</span>
            </div>
          </div>
          <div className="offer-badge">
            <span>NEW</span>
            <strong>2026</strong>
            <small>COLLECTION</small>
          </div>
        </div>
      </section>
      <section className="trending-beauty">
        <div className="trending-heading">
          <div>
            <p>BEAUTIQUE FAVORITES</p>
            <h2>
              Trending <span>Beauty Picks</span>
            </h2>
          </div>
          <Link to="/products" className="view-all-btn">
            View All →
          </Link>
        </div>
        <div className="trending-products">
          {featuredLoading ? (
            <div className="no-featured-products">
              <p>Loading...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product, index) => (
              <div
                className="trending-card"
                key={product._id}
              >
                <div className="product-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="product-visual-box">
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                  {product.badge && (
                    <div className="product-badge">
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <span>
                    {product.category}
                  </span>
                  <h3>{product.name}</h3>
                  <p>
                    {product.description}
                  </p>
                  <div className="product-bottom">
                    <strong>
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </strong>
                    <button
                      type="button"
                      className="add-cart-btn"
                      disabled={addingProduct === product._id}
                      onClick={(e) =>
                        handleAddToCart(e, product._id)
                      }
                    >
                      {addingProduct === product._id ? "..." : "+"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-featured-products">
              <h3>No Trending Products Available</h3>
              <p>
                Featured products will appear here when selected from Admin Panel.
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="product-categories">
        <div className="categories-heading">
          <p>EXPLORE BEAUTIQUE</p>
          <h2>
            Find Your <span>Beauty Essential</span>
          </h2>
          <div className="heading-line"></div>
          <p className="categories-description">
            Explore our carefully selected beauty collections,
            created for your everyday glow.
          </p>
        </div>
        <div className="product-category-grid">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                className={`product-category-card ${getCategoryClass(category.name)}`}
                key={category._id}
              >
                <div className="category-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="category-icon">
                  {getCategoryIcon(category.icon)}
                </div>
                <h3>
                  {category.title || category.name}
                </h3>
                <p>
                  {category.description}
                </p>
                <Link to={getCategoryLink(category.name)}>
                  <button type="button">
                    Explore →
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <div className="no-featured-products">
              <h3>No Categories Available</h3>
              <p>Categories will appear here when added from Admin Panel.</p>
            </div>
          )}
        </div>
      </section>
      <section className="beauty-collection">
        <div className="collection-heading">
          <p>DISCOVER YOUR BEAUTY</p>
          <h2>
            Shop By <span>Collection</span>
          </h2>
          <p className="collection-subtitle">
            Find your favourite beauty essentials
            from our carefully selected collections.
          </p>
        </div>
        <div className="collection-grid">
          <div className="collection-card">
            <img
              src={makeups}
              alt="Makeup Collection"
            />
            <div className="collection-overlay">
              <span>01</span>
              <h3>Makeup</h3>
              <p>
                Lipsticks, blushes & more
              </p>
              <Link to={getCategoryLink("makeup")}>
                <button type="button">
                  Explore →
                </button>
              </Link>
            </div>
          </div>
          <div className="collection-card">
            <img
              src={skincares}
              alt="Skincare Collection"
            />
            <div className="collection-overlay">
              <span>02</span>
              <h3>Skincare</h3>
              <p>
                Glow, care & hydration
              </p>
              <Link to={getCategoryLink("skincare")}>
                <button type="button">
                  Explore →
                </button>
              </Link>
            </div>
          </div>
          <div className="collection-card">
            <img
              src={perfumes}
              alt="Fragrance Collection"
            />
            <div className="collection-overlay">
              <span>03</span>
              <h3>Fragrance</h3>
              <p>
                Elegant everyday scents
              </p>
              <Link to={getCategoryLink("skincare")}>
                <button type="button">
                  Explore →
                </button>
              </Link>
            </div>
          </div>
          <div className="collection-card">
            <img
              src={haircares}
              alt="Haircare Collection"
            />
            <div className="collection-overlay">
              <span>04</span>
              <h3>Hair Care</h3>
              <p>
                Smooth, shine & nourish
              </p>
              <Link to={getCategoryLink("haircare")}>
                <button type="button">
                  Explore →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="beauty-benefits">
        <div className="benefits-heading">
          <p>THE BEAUTIQUE DIFFERENCE</p>
          <h2>
            Why You'll <span>Love It</span>
          </h2>
          <div className="benefits-line"></div>
          <p className="benefits-subtitle">
            Thoughtfully selected beauty essentials made
            to bring a little more luxury into your routine.
          </p>
        </div>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">✦</div>
            <span className="benefit-number">01</span>
            <h3>Carefully Selected</h3>
            <p>
              Every product is selected with
              quality and everyday beauty in mind.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">♡</div>
            <span className="benefit-number">02</span>
            <h3>Beauty You Can Love</h3>
            <p>
              Discover products designed to make
              your daily beauty routine enjoyable.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">◇</div>
            <span className="benefit-number">03</span>
            <h3>Premium Experience</h3>
            <p>
              From product selection to presentation,
              every detail feels special.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">✧</div>
            <span className="benefit-number">04</span>
            <h3>Made For You</h3>
            <p>
              Find beauty essentials that fit
              naturally into your personal routine.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
export default Products;
