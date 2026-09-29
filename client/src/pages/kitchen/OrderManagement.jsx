import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

const statusLabels = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const socket = useSocket();
  const navigate = useNavigate();

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

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const formatDate = (d) => new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  });

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Order Management</h1>
        <p>View and manage incoming customer orders</p>
        <div className="accent-line"></div>
      </div>

      {/* Stats */}
      <div className="dashboard-grid mb-2">
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-number">{orders.filter(o => o.status === 'pending').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Preparing</div>
          <div className="stat-number">{orders.filter(o => o.status === 'preparing').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ready</div>
          <div className="stat-number">{orders.filter(o => o.status === 'ready').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-number">{orders.filter(o => o.status === 'completed').length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="menu-filters mb-2">
        {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map(s => (
          <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : statusLabels[s]}
            {s !== 'all' && ` (${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Orders</h3>
          <p>No orders match the selected filter.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>#{order.id}</td>
                  <td style={{ fontWeight: '500' }}>{order.customer_name}</td>
                  <td>{order.customer_phone || '—'}</td>
                  <td>{order.item_count} item{order.item_count !== 1 ? 's' : ''}</td>
                  <td style={{ fontWeight: '600' }}>₱{parseFloat(order.total).toFixed(2)}</td>
                  <td><span className={`badge badge-${order.status}`}>{statusLabels[order.status]}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(order.created_at)}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/kitchen/orders/${order.id}`)}>
                        View
                      </button>
                      {order.status === 'pending' && (
                        <button className="btn btn-primary btn-sm" onClick={() => updateStatus(order.id, 'preparing')}>
                          Start
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button className="btn btn-primary btn-sm" onClick={() => updateStatus(order.id, 'ready')}>
                          Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button className="btn btn-primary btn-sm" onClick={() => updateStatus(order.id, 'completed')}>
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
