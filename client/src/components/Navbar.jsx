import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navConfig = {
  customer: [
    { path: '/reservation', label: 'Reservation' },
    { path: '/my-reservations', label: 'My Reservations' },
    { path: '/queue-status', label: 'Queue Status' },
    { path: '/menu', label: 'Digital Menu' },
    { path: '/cart', label: 'Cart' },
    { path: '/order-status', label: 'Order Status' },
  ],
  reservation_staff: [
    { path: '/staff/reservations', label: 'Reservations' },
    { path: '/staff/queue', label: 'Queue' },
    { path: '/staff/tables', label: 'Tables' },
    { path: '/staff/seating', label: 'Seating' },
  ],
  kitchen_staff: [
    { path: '/kitchen/orders', label: 'Orders' },
    { path: '/kitchen/order-status', label: 'Status Mgmt' },
  ],
  management: [
    { path: '/management/dashboard', label: 'Dashboard' },
    { path: '/staff/reservations', label: 'Reservations' },
    { path: '/staff/queue', label: 'Queue' },
    { path: '/staff/tables', label: 'Tables' },
    { path: '/staff/seating', label: 'Seating' },
    { path: '/kitchen/orders', label: 'Orders' },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const links = navConfig[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatRole = (role) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <div className="navbar-logo">VG</div>
          <div className="brand-text">
            <span className="brand-name">Viking Grill</span>
            <span className="brand-tagline">Bar • Billiards • KTV</span>
          </div>
        </NavLink>

        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              {link.path === '/cart' && itemCount > 0 && (
                <span style={{
                  marginLeft: '0.3rem',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.68rem',
                  fontWeight: '700',
                }}>
                  {itemCount}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="nav-user">
          <div className="nav-user-info">
            <div className="nav-user-name">{user.name}</div>
            <div className="nav-user-role">{formatRole(user.role)}</div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
