import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const navMenuRef = useRef(null);
  const navRef = useRef(null);

  const handleNav = () => {
    const newState = !showNav;
    setShowNav(newState);
    
    // Toggle shifted class on elements
    document.querySelector(".main-content").classList.toggle("shifted", newState);
    document.querySelector(".heading").classList.toggle("shifted", newState);
    
    // Prevent scrolling when nav is open
    document.body.style.overflow = newState ? 'hidden' : 'auto';
  };

  const closeNav = () => {
    setShowNav(false);
    document.querySelector(".main-content").classList.remove("shifted");
    document.querySelector(".heading").classList.remove("shifted");
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNav && navRef.current && !navRef.current.contains(event.target)) {
        closeNav();
      }
    };

    const handleTouchMove = (e) => {
      if (showNav) {
        e.preventDefault();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('touchmove', handleTouchMove);
      document.body.style.overflow = 'hidden auto'; // Cleanup
    };
  }, [showNav]);

  useEffect(() => {
    if (showNav && navMenuRef.current) {
      navMenuRef.current.classList.remove('slidein');
      void navMenuRef.current.offsetWidth; // force reflow
      navMenuRef.current.classList.add('slidein');
    }
  }, [showNav]);

  return (
    <>
      <nav className={`nav ${showNav ? "show" : ""}`} ref={navRef}>
        <div className="handle" onClick={handleNav}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul ref={navMenuRef} className="nav-menu">
          <li><Link to="/" onClick={closeNav}>Home</Link></li>
          <li><Link to="/create" onClick={closeNav}>Create Blog</Link></li>
          <li><Link to="/about" onClick={closeNav}>About</Link></li>
          <h6 className="version"><hr />version 1.0</h6>
        </ul>
      </nav>
      
      {/* Overlay that closes the nav when clicked */}
      {showNav && (
        <div 
          className="nav-overlay"
          onClick={closeNav}
          onTouchStart={closeNav}
        />
      )}
    </>
  );
}

export default Navbar;