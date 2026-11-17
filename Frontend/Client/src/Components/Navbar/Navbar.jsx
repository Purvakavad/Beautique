
import { useState, useEffect, useContext } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";

import {
  FaSearch,
  FaHeart,
  FaUser,
  FaShoppingCart,
  FaUserCircle,
  FaBox,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";

import { ProductContext } from "../../Context/ProductContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const {
    searchQuery,
    setSearchQuery,
    cartCount,
    fetchCart,
    setCartItems
  } = useContext(ProductContext);

  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // CHECK AUTH
  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`,
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
        await fetchCart();
      }
    } catch (error) {
      setUser(null);
      setCartItems([]);
    }
  };

  useEffect(() => {
    checkAuth();

    window.addEventListener("authChanged", checkAuth);

    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  // SEARCH
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate("/products");
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  // USER
  const handleUserClick = () => {
    if (!user) {
      navigate("/login");
      setMenuOpen(false);
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        setUser(null);
        setCartItems([]);
        setDropdownOpen(false);
        setMenuOpen(false);
        navigate("/");
      }
    } catch (error) {
      console.log(
        "Logout Error:",
        error.response?.data || error.message
      );
    }
  };

  // CLOSE MOBILE MENU
  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className="navbar">

        {/* LOGO */}
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Beautique Logo" />
          </Link>
        </div>

        {/* NAV LINKS */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
          <li><Link to="/product" onClick={closeMenu}>Products</Link></li>
          <li><Link to="/Categories" onClick={closeMenu}>Categories</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="nav-right">

          {/* SEARCH */}
          <FaSearch
            className="icons search-icon"
            onClick={() => {
              setSearchOpen(!searchOpen);
              setMenuOpen(false);
            }}
          />

          {/* WISHLIST */}
          <FaHeart
            className="icons heart-icon"
            onClick={() => {
              navigate("/wishlist");
              closeMenu();
            }}
          />

          {/* USER MENU */}
          <div
            className="user-menu"
            onMouseEnter={() => {
              if (window.innerWidth > 768 && user) {
                setDropdownOpen(true);
              }
            }}
            onMouseLeave={() => {
              if (window.innerWidth > 768) {
                setDropdownOpen(false);
              }
            }}
          >
            <FaUser
              className="icons user-icon"
              onClick={handleUserClick}
            />

            {user && dropdownOpen && (
              <div className="user-dropdown">

                <div className="dropdown-user-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>

                <div className="dropdown-divider"></div>

                <button
                  onClick={() => {
                    closeMenu();
                    navigate("/profile");
                  }}
                >
                  <FaUserCircle />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    closeMenu();
                    navigate("/myorders");
                  }}
                >
                  <FaBox />
                  <span>My Orders</span>
                </button>

                <button
                  onClick={() => {
                    closeMenu();
                    navigate("/myappointment");
                  }}
                >
                  <FaBox />
                  <span>My Appointments</span>
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>

              </div>
            )}
          </div>

          {/* CART */}
          <div
            className="cart-icon"
            onClick={() => {
              navigate("/cart");
              closeMenu();
            }}
          >
            <FaShoppingCart className="icons" />

            <span className="cart-count">
              {cartCount}
            </span>
          </div>

          {/* BOOK NOW */}
          <button
            className="book-now-btn"
            onClick={() => {
              navigate("/booknow");
              closeMenu();
            }}
          >
            Book Now
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            className="menu-toggle"
            onClick={() => {
              setMenuOpen(!menuOpen);
              setDropdownOpen(false);
            }}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

        </div>
      </nav>

      {/* SEARCH BOX */}
      {searchOpen && (
        <div className="navbar-search-box">

          <form
            className="search-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <FaSearch className="search-form-icon" />

            <input
              type="text"
              placeholder="Search beauty products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              type="button"
              className="search-close"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
            >
              ×
            </button>
          </form>

        </div>
      )}
    </>
  );
}

export default Navbar;
