import React from "react";
import "./navbar.css";
import ProfileDropdown from "../../components/profileDropdown/profileDropdown";

const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <ProfileDropdown />
      </ul>
    </nav>
  );
};

export default NavBar;
