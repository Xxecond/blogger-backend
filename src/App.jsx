import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateBlog from "./pages/CreateBlog";
import About from "./pages/About";
import BlogDetails from "./pages/BlogDetails";
import Header from './components/Header';
import EditBlog from './pages/EditBlog';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import Splash from './pages/splash';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Only show splash on initial load (not on route changes)
    if (location.pathname === '/') {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3500); // Match splash duration (3s + 0.5s fade)
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, [location]);

  return (
    <>
      {showSplash ? (
        <Splash />
      ) : (
        <>
          <Navbar />
          <Header />
          <div className="main-content">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/create' element={<CreateBlog />} />
              <Route path='/about' element={<><About /><Footer /></>} />
              <Route path='/blog/:id' element={<BlogDetails />} />
              <Route path='/edit/:id' element={<EditBlog />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
        </>
      )}
    </>
  );
}

export default App;