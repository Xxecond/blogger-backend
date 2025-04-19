import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const navRef = useRef(null);

  const handleNav = () => {
    setShowNav(!showNav);
    document.body.classList.toggle("nav-open", !showNav);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowNav(false);
        document.body.classList.remove("nav-open");
      }
    };

    if (showNav) {
      document.addEventListener('mousedown', handleClickOutside);
    }

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
      
      <div className={`nav-menu ${showNav ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>
        <ul>
          <li>
            <Link to="/" onClick={() => {
              setShowNav(false);
              document.body.classList.remove("nav-open");
            }}>Home</Link>
          </li>
          <li>
            <Link to="/create" onClick={() => {
              setShowNav(false);
              document.body.classList.remove("nav-open");
            }}>Create Blog</Link>
          </li>
          <li>
            <Link to="/about" onClick={() => {
              setShowNav(false);
              document.body.classList.remove("nav-open");
            }}>About</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;