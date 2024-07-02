import React from "react";
import { Link } from "react-router-dom";
import ProfileDropdown from "../../components/profileDropdown/profileDropdown.tsx";
import "./navbar.css"; // Import the CSS file

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/list" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>
      <ProfileDropdown />
    </nav>
  );
};

export default Navbar;
