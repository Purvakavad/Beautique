import Hero from '../../Components/Hero/Hero'
import Categories from '../../Components/Categories/Categories'
import Review from '../../Components/Review/Review'
import "./Home.css"
import { Link } from 'react-router-dom'
const Home = () => {
    return (
        <>
            <Hero />
            <Categories />
            <section className="about-cta-section">
                <div className="about-cta-content">
                    <div className="cta-icon">
                        ✦
                    </div>
                    <h4>YOUR BEAUTY JOURNEY STARTS HERE</h4>
                    <h2>
                        Feel Beautiful. <span>Feel Confident.</span>
                    </h2>
                    <p>
                        Discover premium beauty products carefully selected
                        to make your everyday beauty routine more special.
                    </p>
                    <Link to="/products">
                        <button className="cta-btn" >
                            Explore Our Products
                        </button>
                    </Link>
                </div>
            </section>
            <Review />
        </>
    )
}
export default Home