import React from "react";
import "./navbar.css";
import kwaaiLogo from "../../assets/kwaai-logo.svg";


const NavBar: React.FC = () => {
  return (
    <nav className="navbar">
      <img src={kwaaiLogo} alt="Kwaai Logo" className="navbar-logo" />
      <ul className="navbar-menu">
      </ul>
    </nav>
  );
};

export default NavBar;
