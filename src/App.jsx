import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import CreateBlog from './pages/CreateBlog';
import About from './pages/About';
import BlogDetails from './pages/BlogDetails';
import EditBlog from './pages/EditBlog';
import NotFound from './pages/NotFound';
import Splash from './pages/splash';
import Login from './pages/login';
import Signup from './pages/signup';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      const timer = setTimeout(() => setShowSplash(false), 3500);
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, [location]);

  const hideNavRoutes = ['/login', '/signup'];

  return (
    <>
      {showSplash ? (
        <Splash />
      ) : (
        <>
          {!hideNavRoutes.includes(location.pathname) && (
            <>
              <Navbar />
              <Header />
            </>
          )}

          <div className="main-content">
            <Routes>
              {/* Default to login */}
              <Route path="/" element={<Navigate to="/login" />} />

              {/* Auth pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Main App Routes */}
              <Route path="/home" element={<Home />} />
              <Route path="/create" element={<CreateBlog />} />
              <Route path="/about" element={<><About /><Footer /></>} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/edit/:id" element={<EditBlog />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </>
      )}
    </>
  );
}

export default App;
