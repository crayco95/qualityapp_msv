import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  Package,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  Shield,
  Award
} from 'lucide-react';
import '../../styles/Sidebar.css';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Shield size={24} />
          <span>Quality App</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {user?.role === 'admin' && (
            <li>
              <Link to="/dashboard\" className={isActive('/dashboard') ? 'active' : ''}>
                <LayoutDashboard size={20} />
                <span>Panel</span>
              </Link>
            </li>
          )}

          {user?.role === 'admin' && (
            <>
              <li>
                <Link to="/users" className={isActive('/users') ? 'active' : ''}>
                  <Users size={20} />
                  <span>Gestión de Usuarios</span>
                </Link>
              </li>
              <li>
                <Link to="/participants" className={isActive('/participants') ? 'active' : ''}>
                  <Users size={20} />
                  <span>Participantes</span>
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/software" className={isActive('/software') ? 'active' : ''}>
              <Package size={20} />
              <span>Software</span>
            </Link>
          </li>

          {user?.role === 'admin' && (
            <>
              <li>
                <Link to="/standards" className={isActive('/standards') ? 'active' : ''}>
                  <ClipboardCheck size={20} />
                  <span>Normas de Calidad</span>
                </Link>
              </li>
              <li>
                <Link to="/classifications" className={isActive('/classifications') ? 'active' : ''}>
                  <Award size={20} />
                  <span>Clasificaciones</span>
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/evaluations" className={isActive('/evaluations') ? 'active' : ''}>
              <FileText size={20} />
              <span>Evaluaciones</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0)}
            </div>
            <div className="user-details">
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </div>
        )}

        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;