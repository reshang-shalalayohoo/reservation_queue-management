import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import EmptyState from '../../components/common/EmptyState';

export default function OrderConfirmation() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="page-container">
        <EmptyState
          illustration="receipt"
          title="No items to confirm."
          description="Add items to your cart before placing an order."
          actionLabel="Browse Menu"
          onAction={() => navigate('/menu')}
        />
      </div>
    );
  }

  const handleConfirm = async () => {
    setError('');
    setLoading(true);

    try {
      const orderItems = items.map(i => ({
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
      }));

      await api.post('/orders', {
        items: orderItems,
        notes: notes || undefined,
      });

      clearCart();
      navigate('/order-status');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Order Confirmation</h1>
        <p>Review your order before submitting</p>
        <div className="accent-line"></div>
      </div>

      <div style={{ maxWidth: '700px' }}>
        {error && <div className="alert alert-error">⚠ {error}</div>}

        <div className="card mb-2">
          <div className="card-header">
            <h3>Order Items</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Price</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.menu_item_id}>
                    <td>
                      <div style={{ fontWeight: '500' }}>{item.name}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>₱{item.price.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card mb-2">
          <div className="card-body">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Special Instructions (Optional)</label>
              <textarea
                className="form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for the kitchen?"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="cart-summary">
          <div className="cart-summary-row total">
            <span>Total Amount</span>
            <span className="amount">₱{total.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/cart')} style={{ flex: 1 }}>
              ← Back to Cart
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleConfirm}
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Placing Order...' : '✓ Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
