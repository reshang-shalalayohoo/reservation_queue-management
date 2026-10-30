import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to appropriate home page based on role
    const roleHome = {
      customer: '/menu',
      reservation_staff: '/staff/reservations',
      kitchen_staff: '/kitchen/orders',
      management: '/management/dashboard',
    };
    return <Navigate to={roleHome[user.role] || '/login'} replace />;
  }

  return children;
}
