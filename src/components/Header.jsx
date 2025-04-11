import React from "react";
import { useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const headings = {
    '/': 'FOOTBALL INSIDER ',
    '/create': 'Create New Blog',
    '/edit/1743673110083':'Edit Blog',
    '/about':'About'
  };

  const pageName = headings[location.pathname] || 'Error';

  return (
    <div className="heading">
      <h1>{pageName}</h1>
    </div>
  );
}

export default Header;
