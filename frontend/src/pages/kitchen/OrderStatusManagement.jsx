import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import EmptyState from '../../components/common/EmptyState';

const statusLabels = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const statusFlow = ['pending', 'preparing', 'ready', 'completed'];

export default function OrderStatusManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      // Show only active orders
      setOrders(res.data.orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled'));
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handle = () => fetchOrders();
    socket.on('order:new', handle);
    socket.on('order:update', handle);
    return () => {
      socket.off('order:new', handle);
      socket.off('order:update', handle);
    };
  }, [socket]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update.');
    }
  };

  const getNextStatus = (current) => {
    const idx = statusFlow.indexOf(current);
    return idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  const formatDate = (d) => new Date(d).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Order Status Management</h1>
        <p>Update order preparation status in real-time</p>
        <div className="accent-line"></div>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          illustration="orderBoard"
          title="No orders to update."
          description="Active orders will appear here for status management."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {orders.map(order => {
            const nextStatus = getNextStatus(order.status);
            return (
              <div key={order.id} className="card" style={{
                borderColor: order.status === 'pending' ? 'var(--color-primary)' : 'var(--border-color)',
              }}>
                <div className="card-header">
                  <div>
                    <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.05rem' }}>
                      Order #{order.id}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                  <span className={`badge badge-${order.status}`}>{statusLabels[order.status]}</span>
                </div>
                <div className="card-body">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <div style={{ fontWeight: '500' }}>{order.customer_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {order.item_count} item{order.item_count !== 1 ? 's' : ''} • ₱{parseFloat(order.total).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      display: 'flex',
                      gap: '3px',
                      height: '4px',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      {statusFlow.map((step, idx) => (
                        <div key={step} style={{
                          flex: 1,
                          background: idx <= statusFlow.indexOf(order.status)
                            ? 'var(--color-primary)'
                            : 'var(--border-color)',
                          transition: 'background 0.3s ease',
                        }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      {statusFlow.map(step => (
                        <span key={step} style={{
                          fontSize: '0.62rem',
                          color: statusFlow.indexOf(step) <= statusFlow.indexOf(order.status)
                            ? 'var(--text-secondary)'
                            : 'var(--text-muted)',
                          fontWeight: step === order.status ? '600' : '400',
                        }}>
                          {statusLabels[step]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="btn-group" style={{ justifyContent: 'stretch' }}>
                    {nextStatus && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => updateStatus(order.id, nextStatus)}
                        style={{ flex: 1 }}
                      >
                        → {statusLabels[nextStatus]}
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateStatus(order.id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {orders.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <span className="animate-pulse">🔄</span> Updates sync in real-time to customers
        </div>
      )}
    </div>
  );
}
