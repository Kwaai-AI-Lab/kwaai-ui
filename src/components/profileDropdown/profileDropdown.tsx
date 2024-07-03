import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import './profileDropdown.css'; // Import the CSS file

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-dropdown">
      <button onClick={toggleDropdown} className="profile-button">
        {currentUser ? currentUser.email : 'Profile'}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={() => navigate('/settings')}>Settings</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;