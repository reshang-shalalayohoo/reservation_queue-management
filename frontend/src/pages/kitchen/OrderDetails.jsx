import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    const handle = (data) => {
      if (data.id === parseInt(id)) fetchOrder();
    };
    socket.on('order:update', handle);
    return () => socket.off('order:update', handle);
  }, [socket, id]);

  const updateStatus = async (status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update.');
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  if (!order) {
    return (
      <div className="page-container">
        <EmptyState
          illustration="notFound"
          title="Order Not Found"
          description="The order you're looking for doesn't exist or has been removed."
          actionLabel="← Back to Orders"
          onAction={() => navigate('/kitchen/orders')}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <button className="btn btn-secondary btn-sm mb-2" onClick={() => navigate('/kitchen/orders')}>
        ← Back to Orders
      </button>

      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1>Order #{order.id}</h1>
            <div style={{ marginTop: '0.5rem' }}>
              <span className={`badge badge-${order.status}`}>{statusLabels[order.status]}</span>
            </div>
          </div>
          <div className="btn-group">
            {order.status === 'pending' && (
              <button className="btn btn-primary" onClick={() => updateStatus('preparing')}>Start Preparing</button>
            )}
            {order.status === 'preparing' && (
              <button className="btn btn-primary" onClick={() => updateStatus('ready')}>Mark Ready</button>
            )}
            {order.status === 'ready' && (
              <button className="btn btn-primary" onClick={() => updateStatus('completed')}>Complete Order</button>
            )}
            {(order.status === 'pending' || order.status === 'preparing') && (
              <button className="btn btn-danger" onClick={() => updateStatus('cancelled')}>Cancel</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Customer Info */}
        <div className="card">
          <div className="card-header"><h3 style={{ color: 'var(--color-primary)' }}>Customer Information</h3></div>
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Name</div>
                <div className="detail-value">{order.customer_name}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Email</div>
                <div className="detail-value">{order.customer_email}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Phone</div>
                <div className="detail-value">{order.customer_phone || '—'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Placed At</div>
                <div className="detail-value">{new Date(order.created_at).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card">
          <div className="card-header"><h3 style={{ color: 'var(--color-primary)' }}>Order Summary</h3></div>
          <div className="card-body">
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Total Items</div>
                <div className="detail-value">{order.items?.length || 0}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Total Amount</div>
                <div className="detail-value" style={{ color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: '700' }}>
                  ₱{parseFloat(order.total).toFixed(2)}
                </div>
              </div>
              {order.notes && (
                <div className="detail-item detail-full">
                  <div className="detail-label">Notes</div>
                  <div className="detail-value">{order.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card mt-2">
        <div className="card-header"><h3 style={{ color: 'var(--color-primary)' }}>Ordered Items</h3></div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Quantity</th>
                <th style={{ textAlign: 'right' }}>Unit Price</th>
                <th style={{ textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-1">
                      {item.image_url && (
                        <img src={item.image_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                      )}
                      <div>
                        <div style={{ fontWeight: '500' }}>{item.item_name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {item.category?.replace('_', ' ')}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>₱{parseFloat(item.unit_price).toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontWeight: '600', color: 'var(--color-primary)' }}>
                    ₱{parseFloat(item.subtotal).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
