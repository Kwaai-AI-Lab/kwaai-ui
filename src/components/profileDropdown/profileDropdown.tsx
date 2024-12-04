import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserEmail, logout } from '../../utils/auth.helper';
import './profileDropdown.css'; // Import the CSS file


const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const currentUser = getUserEmail();

  return (
    <div className="profile-dropdown">
      <button onClick={toggleDropdown} className="profile-button">
        {currentUser ? currentUser : 'Profile'}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;