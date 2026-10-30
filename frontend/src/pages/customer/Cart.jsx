import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import EmptyState from '../../components/common/EmptyState';

export default function Cart() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Your Cart</h1>
          <p>Items you've selected from the menu</p>
          <div className="accent-line"></div>
        </div>
        <EmptyState
          illustration="shoppingCart"
          title="Your cart is empty."
          description="Browse our menu and add something delicious to get started."
          actionLabel="Browse Menu"
          onAction={() => navigate('/menu')}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Your Cart</h1>
        <p>{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
        <div className="accent-line"></div>
      </div>

      <div style={{ maxWidth: '800px' }}>
        <div className="cart-items">
          {items.map(item => (
            <div key={item.menu_item_id} className="cart-item">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="cart-item-image" />
              ) : (
                <div className="cart-item-image" style={{
                  background: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}>🍖</div>
              )}

              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">₱{item.price.toFixed(2)} each</div>
              </div>

              <div className="cart-item-qty">
                <button className="qty-btn" onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}>−</button>
                <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                <button className="qty-btn" onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}>+</button>
              </div>

              <div className="cart-item-subtotal">
                ₱{(item.price * item.quantity).toFixed(2)}
              </div>

              <button className="cart-item-remove" onClick={() => removeItem(item.menu_item_id)} title="Remove">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-row">
            <span style={{ color: 'var(--text-muted)' }}>Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="cart-summary-row">
            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row total">
            <span>Total</span>
            <span className="amount">₱{total.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/menu')} style={{ flex: 1 }}>
              Continue Browsing
            </button>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/order-confirmation')} style={{ flex: 1 }}>
              Proceed to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
