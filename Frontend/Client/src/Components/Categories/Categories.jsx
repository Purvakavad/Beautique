import "./Categories.css";
import { useNavigate } from "react-router-dom";
import mackup from "../../assets/categori/mackup.jpg";
import skincare from "../../assets/categori/skincare.png";
import perfume from "../../assets/categori/perfume.png";
import haircare from "../../assets/categori/haircare.jpg";
import nail from "../../assets/categori/nail.png";
import bodycare from "../../assets/categori/bodycare.png";
function Categories() {
  const navigate = useNavigate();
  const handleCategoryClick = (categoryName) => {
    navigate(
      `/products?category=${encodeURIComponent(categoryName)}`
    );
  };
  return (
    <section className="categories">
      <div className="category-title">
        <h4>Shop By Category</h4>
        <h2>Beauty Categories</h2>
      </div>
      <div className="category-grid">
        <div
          className="category-card"
          onClick={() => handleCategoryClick("Makeup")}
        >
          <img src={mackup} alt="Makeup" />
          <h3>Makeup</h3>
          <p>Luxury Lipsticks & Makeup Kits</p>
        </div>
        <div
          className="category-card"
          onClick={() => handleCategoryClick("Skincare")}
        >
          <img src={skincare} alt="Skincare" />
          <h3>Skincare</h3>
          <p>Healthy & Glowing Skin Products</p>
        </div>
        <div
          className="category-card"
          onClick={() => handleCategoryClick("Perfume")}
        >
          <img src={perfume} alt="Perfume" />
          <h3>Perfume</h3>
          <p>Luxury Fragrances Collection</p>
        </div>
        <div
          className="category-card"
          onClick={() => handleCategoryClick("Haircare")}
        >
          <img src={haircare} alt="Hair Care" />
          <h3>Hair Care</h3>
          <p>Healthy Hair Essentials</p>
        </div>
        <div
          className="category-card"
          onClick={() => handleCategoryClick("Nail Care")}
        >
          <img src={nail} alt="Nail Care" />
          <h3>Nail Care</h3>
          <p>Nail Polish & Nail Art</p>
        </div>
        <div
          className="category-card"
          onClick={() => handleCategoryClick("Body Care")}
        >
          <img src={bodycare} alt="Body Care" />
          <h3>Body Care</h3>
          <p>Body Lotion & Body Wash</p>
        </div>
      </div>
    </section>
  );
}
export default Categories;
