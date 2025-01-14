import React from 'react';
import '../css/Navbar.css';
import logo from '../images/ParakeetLogo.png';  // Import the logo image
import profileLogo from '../images/user-profile-03.png';

const Navbar = () => {
    return (
  
  <nav className="navbar">
    <div className="navbar-left">
      <a href="/" className="logo">
          <img src={logo} alt="ShopNow Logo" className="logo-image" />
          <span className="logo-text">Parakeet</span>
      </a>
    </div>
    <div className="navbar-center">
      <ul className="nav-links">
        <li>
          <a href="/products">Products</a>
        </li>
        <li>
          <a href="/about">About Us</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </div>
    <div className="navbar-right">
      <a href="/profile" className="cart-icon">
        <img src={profileLogo} alt="" style={{ width: '35px', height: 'auto' }} />
        <span className="cart-count">0</span>
      </a>
      <a href="/account" className="user-icon">
        <i className="fas fa-user"></i>
      </a>
    </div>
  </nav>
  );
  };

export default Navbar;