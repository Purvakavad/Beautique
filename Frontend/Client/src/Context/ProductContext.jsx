import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
export const ProductContext = createContext();
const ProductContextProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) || null;
    });
    const [wishlist, setWishlist] = useState(() => {
        return JSON.parse(localStorage.getItem("wishlist")) || [];
    });
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/categories/getCategories`
            );
            const data = response.data;
            setCategories(
                Array.isArray(data)
                    ? data
                    : data.categories || data.data || []
            );
        } catch (err) {
            console.log("Fetch Categories Error:", err);
        }
    };
    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/Product/getProducts`
            );
            const data = response.data;
            setProducts(
                Array.isArray(data)
                    ? data
                    : data.products || data.data || []
            );
        } catch (err) {
            console.log("Fetch Products Error:", err);
        }
    };
    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`,
                {
                    withCredentials: true
                }
            );
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.log(
                "Fetch User Error:",
                error.response?.data || error.message
            );
            setUser(null);
        }
    };
    useEffect(() => {
        fetchUser();
        fetchCategories();
        fetchProducts();
    }, []);
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);
    const toggleWishlist = (product) => {
        setWishlist((prev) => {
            const exists = prev.some(
                (item) => item._id === product._id
            );
            if (exists) {
                return prev.filter(
                    (item) => item._id !== product._id
                );
            }
            return [...prev, product];
        });
    };
    const [cartItems, setCartItems] = useState([]);
    const fetchCart = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart/get`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setCartItems(response.data.cart?.items || []);
            }
        } catch (error) {
            console.log(
                "Fetch Cart Error:",
                error.response?.data || error.message
            );
            setCartItems([]);
        }
    };
    const addToCart = async (productId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart/add`,
                { productId },
                { withCredentials: true }
            );
            if (response.data.success) {
                await fetchCart();
                return {
                    success: true
                };
            }
            return {
                success: false,
                message: response.data.message || "Unable to add product to cart."
            };
        } catch (error) {
            console.log(
                "Add To Cart Error:",
                error.response?.data || error.message
            );
            if (error.response?.status === 401) {
                return {
                    success: false,
                    unauthorized: true
                };
            }
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Unable to add product to cart."
            };
        }
    };
    const cartCount = cartItems.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );
    const contextValue = {
        searchQuery,
        navigate,
        setSearchQuery,
        wishlist,
        setWishlist,
        toggleWishlist,
        user,
        setUser,
        cartItems,
        setCartItems,
        cartCount,
        fetchCart,
        addToCart,
        categories,
        products,
        fetchCategories,
        fetchProducts
    };
    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
};
export default ProductContextProvider;
