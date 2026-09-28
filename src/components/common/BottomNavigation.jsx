import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Heart, PlusCircle, User } from 'lucide-react';
import { useSaved } from '../../context/SavedContext';
import { useAuth } from '../../context/AuthContext';

export default function BottomNavigation() {
  const { savedIds } = useSaved();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bottom-nav" aria-label="Mobile Navigation">
      <NavLink 
        to="/" 
        end
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink 
        to={isAuthenticated ? "/search" : "/login"} 
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Compass size={20} />
        <span>Explore</span>
      </NavLink>

      <NavLink 
        to={isAuthenticated ? "/sell" : "/login"} 
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <PlusCircle size={20} />
        <span>Sell</span>
      </NavLink>

      <NavLink 
        to={isAuthenticated ? "/saved" : "/login"} 
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <Heart size={20} />
        <span>Saved</span>
        {savedIds.length > 0 && (
          <span className="bottom-nav-badge">{savedIds.length}</span>
        )}
      </NavLink>

      <NavLink 
        to={isAuthenticated ? "/dashboard" : "/login"} 
        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
      >
        <User size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
