import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Customer pages
import Reservation from './pages/customer/Reservation';
import MyReservations from './pages/customer/MyReservations';
import QueueStatus from './pages/customer/QueueStatus';
import DigitalMenu from './pages/customer/DigitalMenu';
import MenuItemDetails from './pages/customer/MenuItemDetails';
import Cart from './pages/customer/Cart';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import OrderStatus from './pages/customer/OrderStatus';

// Staff pages
import ReservationManagement from './pages/staff/ReservationManagement';
import ReservationDetails from './pages/staff/ReservationDetails';
import QueueManagement from './pages/staff/QueueManagement';
import TableManagement from './pages/staff/TableManagement';
import SeatingManagement from './pages/staff/SeatingManagement';

// Kitchen pages
import OrderManagement from './pages/kitchen/OrderManagement';
import OrderDetails from './pages/kitchen/OrderDetails';
import OrderStatusManagement from './pages/kitchen/OrderStatusManagement';

// Management pages
import Dashboard from './pages/management/Dashboard';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
        <p className="loading-text">Loading Viking Grill...</p>
      </div>
    );
  }

  // Determine default redirect based on role
  const getDefaultRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'customer': return '/menu';
      case 'reservation_staff': return '/staff/reservations';
      case 'kitchen_staff': return '/kitchen/orders';
      case 'management': return '/management/dashboard';
      default: return '/login';
    }
  };

  return (
    <div className="app-container">
      {user && <Navbar />}
      <main className={user ? 'main-content' : ''}>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to={getDefaultRoute()} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={getDefaultRoute()} />} />

          {/* Customer */}
          <Route path="/reservation" element={
            <ProtectedRoute roles={['customer']}><Reservation /></ProtectedRoute>
          } />
          <Route path="/my-reservations" element={
            <ProtectedRoute roles={['customer']}><MyReservations /></ProtectedRoute>
          } />
          <Route path="/queue-status" element={
            <ProtectedRoute roles={['customer']}><QueueStatus /></ProtectedRoute>
          } />
          <Route path="/menu" element={
            <ProtectedRoute roles={['customer']}><DigitalMenu /></ProtectedRoute>
          } />
          <Route path="/menu/:id" element={
            <ProtectedRoute roles={['customer']}><MenuItemDetails /></ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute roles={['customer']}><Cart /></ProtectedRoute>
          } />
          <Route path="/order-confirmation" element={
            <ProtectedRoute roles={['customer']}><OrderConfirmation /></ProtectedRoute>
          } />
          <Route path="/order-status" element={
            <ProtectedRoute roles={['customer']}><OrderStatus /></ProtectedRoute>
          } />

          {/* Reservation Staff */}
          <Route path="/staff/reservations" element={
            <ProtectedRoute roles={['reservation_staff', 'management']}><ReservationManagement /></ProtectedRoute>
          } />
          <Route path="/staff/reservations/:id" element={
            <ProtectedRoute roles={['reservation_staff', 'management']}><ReservationDetails /></ProtectedRoute>
          } />
          <Route path="/staff/queue" element={
            <ProtectedRoute roles={['reservation_staff', 'management']}><QueueManagement /></ProtectedRoute>
          } />
          <Route path="/staff/tables" element={
            <ProtectedRoute roles={['reservation_staff', 'management']}><TableManagement /></ProtectedRoute>
          } />
          <Route path="/staff/seating" element={
            <ProtectedRoute roles={['reservation_staff', 'management']}><SeatingManagement /></ProtectedRoute>
          } />

          {/* Kitchen Staff */}
          <Route path="/kitchen/orders" element={
            <ProtectedRoute roles={['kitchen_staff', 'management']}><OrderManagement /></ProtectedRoute>
          } />
          <Route path="/kitchen/orders/:id" element={
            <ProtectedRoute roles={['kitchen_staff', 'management']}><OrderDetails /></ProtectedRoute>
          } />
          <Route path="/kitchen/order-status" element={
            <ProtectedRoute roles={['kitchen_staff', 'management']}><OrderStatusManagement /></ProtectedRoute>
          } />

          {/* Management */}
          <Route path="/management/dashboard" element={
            <ProtectedRoute roles={['management']}><Dashboard /></ProtectedRoute>
          } />

          {/* Default */}
          <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
