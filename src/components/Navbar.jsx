import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const navMenuRef = useRef(null);

  const handleNav = () => {
    setShowNav(prev => !prev);
    document.querySelector(".main-content").classList.toggle("shifted");
document.querySelector(".heading").classList.toggle("shifted");
  };

  const closeNav = () => {
    setShowNav(false);
    document.querySelector(".main-content").classList.remove("shifted");
    document.querySelector(".heading").classList.remove("shifted");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNav && !event.target.closest('.nav')) {
        closeNav();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    <nav className={`nav ${showNav ? "show" : ""}`}>
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
  );
}

export default Navbar;