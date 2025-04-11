import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="nopage">
      <h1>404 - Page Not Found</h1>
      <p >Oops! The page you are looking for does not exist.</p>
      <Link to="/">
        🔙 Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
