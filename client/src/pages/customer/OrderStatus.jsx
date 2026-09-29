import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

const statusSteps = ['pending', 'preparing', 'ready', 'completed'];
const statusLabels = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function OrderStatus() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Real-time order updates
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (data) => {
      setOrders(prev =>
        prev.map(o => (o.id === data.id ? { ...o, ...data } : o))
      );
    };

    socket.on('order:update', handleUpdate);
    return () => socket.off('order:update', handleUpdate);
  }, [socket]);

  const getStepState = (orderStatus, step) => {
    if (orderStatus === 'cancelled') return 'inactive';
    const orderIdx = statusSteps.indexOf(orderStatus);
    const stepIdx = statusSteps.indexOf(step);
    if (stepIdx < orderIdx) return 'completed';
    if (stepIdx === orderIdx) return 'active';
    return 'inactive';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="loading-container"><div className="spinner"></div><p className="loading-text">Loading orders...</p></div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Order Status</h1>
        <p>Track your order progress in real-time</p>
        <div className="accent-line"></div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Orders Yet</h3>
          <p>Place an order from our digital menu to track it here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map(order => (
            <div key={order.id} className="card">
              <div className="card-header">
                <div>
                  <h3 style={{ fontSize: '1rem' }}>Order #{order.id}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${order.status}`}>{statusLabels[order.status]}</span>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                    ₱{parseFloat(order.total).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="card-body">
                {order.status !== 'cancelled' ? (
                  <div className="order-progress">
                    {statusSteps.map((step, idx) => (
                      <div key={step} style={{ display: 'contents' }}>
                        <div className={`progress-step ${getStepState(order.status, step)}`}>
                          <div className="step-circle">
                            {getStepState(order.status, step) === 'completed' ? '✓' : idx + 1}
                          </div>
                          <div className="step-label">{statusLabels[step]}</div>
                        </div>
                        {idx < statusSteps.length - 1 && (
                          <div className={`progress-line ${
                            getStepState(order.status, statusSteps[idx + 1]) !== 'inactive' ? 'completed' : ''
                          }`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                    This order has been cancelled.
                  </div>
                )}

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {order.item_count} item{order.item_count !== 1 ? 's' : ''}
                  {order.notes && <span> • Note: "{order.notes}"</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {orders.some(o => o.status === 'pending' || o.status === 'preparing') && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          <span className="animate-pulse">🔄</span> Status updates automatically in real-time
        </div>
      )}
    </div>
  );
}
