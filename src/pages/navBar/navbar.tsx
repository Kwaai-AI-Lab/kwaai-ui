import React from "react";
import ProfileDropdown from "../../components/profileDropdown/profileDropdown";
import "./navbar.css";

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
