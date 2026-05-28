import React from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/Authenticate';
import Home from './Home';
import Jobs from './Jobs';
import JobDetails from './JobDetails';
import Apply from './Apply';
import './style.css';
import Applications from './Applications';
import Contact from './Contact';
import SignIn from './SignIn';
import SignUp from './SignUp';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <li className="nav-item">
      <Link to={to} className={`nav-link${isActive ? ' active' : ''}`}>
        {children}
      </Link>
    </li>
  );
};

const MainNavBar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p className="loading-text">Loading Job Portal…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<SignIn />} />
      </Routes>
    );
  }

  const initials = user.username
    ? user.username.slice(0, 2).toUpperCase()
    : '?';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" className="logo-link">
              <span className="logo-icon">💼</span>
              <span className="logo-text-main">JobPortal</span>
            </Link>
          </div>

          {/* Nav links */}
          <ul className="nav-menu">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/jobs">Jobs</NavLink>
            <NavLink to="/applications">Applications</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            <li className="nav-item">
              <div className="user-chip">
                <div className="user-avatar">{initials}</div>
                <span>{user.username}</span>
              </div>
            </li>

            <li className="nav-item">
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Routes */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/apply/:id" element={<Apply />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
};

export default MainNavBar;