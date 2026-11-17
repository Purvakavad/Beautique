
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';

const Dashbord = lazy(() => import('./Pages/Dashboard/Dashboard'));
const Appointments = lazy(() => import('./Pages/Appointments/Appointments'));
const Contact = lazy(() => import('./Pages/Contacts/Contact'));
const Users = lazy(() => import('./Pages/Users/Users'));
const Login = lazy(() => import('./Component/Login/Login'));
const Product = lazy(() => import('./Pages/Products/Products'));
const Sidebar = lazy(() => import('./Component/Sidebar/Sidebar'));
const AddProduct = lazy(() => import('./Pages/Products/AddProduct'));
const Orders = lazy(() => import('./Pages/Orders/Orders'));
const Categories = lazy(() => import('./Pages/Categories/Categories'));
const AddCategory = lazy(() => import('./Pages/Categories/AddCategory'));
const Services = lazy(() => import('./Pages/Services/Services'));
const AddService = lazy(() => import('./Pages/Services/AddService'));

import './App.css';

const AppContent = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const isLoginPage = location.pathname === "/login";

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/checkAdminAuth`,
        {
          withCredentials: true,
        }
      );
      if (
        response.data.success &&
        response.data.isAuthenticated
      ) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log("Admin Auth Check Error:", error.response?.data || error.message);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  if (checkingAuth) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && isLoginPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={isLoginPage ? "" : "admin-layout"}>
      {!isLoginPage && <Sidebar />}
      <main className={isLoginPage ? "" : "admin-main"}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashbord />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Product />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/add" element={<AddCategory />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/services" element={<Services />} />
            <Route path="/add-service" element={<AddService />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
