import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Bell, Search } from 'lucide-react';
import '../../styles/Header.css';

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, toggleSidebar }) => {
  const { user } = useAuth();
  
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <h1 className="page-title">{title}</h1>
      </div>
      
      <div className="header-search">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      </div>
      
      <div className="header-right">
        <button className="notification-button">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-menu">
          <div className="user-avatar">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;