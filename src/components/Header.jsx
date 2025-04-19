import Navbar from "./Navbar";
import React from "react";
import { useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const headings = {
    '/': 'FOOTBALL INSIDER ',
    '/create': 'New Blog',
    '/edit':'Edit Blog',
    '/about':'About'
  };

  const pageName = headings[location.pathname] || 'Page';

  return (
    <div className="heading">
      <Navbar />
      <h1>{pageName}</h1>
    </div>
  );
}

export default Header;
