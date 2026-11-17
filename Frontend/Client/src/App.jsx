import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Products from './Pages/Products/Products';
const Navbar = lazy(() => import('./Components/Navbar/Navbar'));
const Footer = lazy(() => import('./Components/Footer/Footer'));
const ScrollToTop = lazy(() => import('./Components/ScrollToTop'));
const Login = lazy(() => import('./Components/Login/Login'));
const Register = lazy(() => import('./Components/Register/Register'));
const Home = lazy(() => import('./Pages/Home/Home'));
const About = lazy(() => import('./Pages/About/About'));
const Service = lazy(() => import('./Pages/service/Services'));
const Product = lazy(() => import('./Pages/Products/Products'));
const Contact = lazy(() => import('./Pages/Contacts/Contact'));
const Wishlist = lazy(() => import('./Pages/Wishlists/Wishlist'));
const Cart = lazy(() => import('./Pages/Cart/Cart'));
const Book = lazy(() => import('./Pages/Book/Booknow'));
const SingleProduct = lazy(() => import('./Pages/SingleProduct/SingleProduct'));
const Profile = lazy(() => import('./Pages/Profile/Profile'));
const Checkout = lazy(() => import('./Pages/Checkout/Checkout'));
const OrderSuccess = lazy(() => import('./Pages/OrderSuccess/OrderSuccess'));
const PaymentSuccess = lazy(() => import('./Pages/PaymentSuccess/PaymentSuccess'));
const MyAppointments = lazy(() => import('./Pages/MyAppointments/MyAppointments'));
const MyOrders = lazy(() => import('./Pages/MyOrders/MyOrders'));
const Categories = lazy(() => import('./Pages/Categories/Categories'));
const ProductByCategory = lazy(() => import('./Pages/ProductByCategory/ProductByCategory'));
const App = () => {
  return (
    <Suspense fallback={<div className="loader">Loading...</div>}>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/services' element={<Service />} />
        <Route path='/product' element={<Products />} />
        <Route path='/Categories' element={<Categories />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/booknow' element={<Book />} />
        <Route path='/register' element={<Register />} />
        <Route path='/products' element={<ProductByCategory />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/product/:id' element={<SingleProduct />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/myappointment" element={<MyAppointments />}></Route>
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Suspense>
  );
};
export default App;
