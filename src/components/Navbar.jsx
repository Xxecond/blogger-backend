import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const navRef = useRef(null);

  const handleNav = () => {
    setShowNav(!showNav);
  document.querySelector(".content").classList.toggle("shift", !showNav);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowNav(false);
      }
    };

    // Add when menu is open
    if (showNav) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNav]);

  return (
    <nav className="nav" ref={navRef}>
      {/* Only show the handle when menu is closed */}
      {!showNav && (
        <div className="handle" onClick={handleNav}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      
      {showNav && (
        <ul className={`nav-menu ${showNav ? "show": ""}`} onClick={(e) => e.stopPropagation()}>
          <li>
            <Link to="/" onClick={handleNav}>Home</Link>
          </li>
          <li>
            <Link to="/create" onClick={handleNav}>Create Blog</Link>
          </li>
          <li><Link to="/about" onClick={handleNav}>About</Link></li>
        </ul>
      )} </nav>
  );
}

export default Navbar;