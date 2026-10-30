import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import EmptyState from '../../components/common/EmptyState';

const categoryLabels = {
  grill: 'Grill',
  main_course: 'Main Course',
  appetizer: 'Appetizer',
  beverage: 'Beverage',
  dessert: 'Dessert',
  bar_snack: 'Bar Snack',
};

export default function MenuItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/menu/${id}`);
        setItem(res.data.item);
      } catch (err) {
        console.error('Failed to fetch item:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleAdd = () => {
    if (!item) return;
    addItem(item, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="loading-container"><div className="spinner"></div><p className="loading-text">Loading item...</p></div>
    );
  }

  if (!item) {
    return (
      <div className="page-container">
        <EmptyState
          illustration="menuItem"
          title="Item Not Found"
          description="The menu item you're looking for doesn't exist or is no longer available."
          actionLabel="Back to Menu"
          onAction={() => navigate('/menu')}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <button className="btn btn-secondary btn-sm mb-2" onClick={() => navigate('/menu')}>
        ← Back to Menu
      </button>

      <div className="item-detail-layout">
        <div>
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="item-detail-image" />
          ) : (
            <div className="item-detail-image" style={{
              background: 'var(--bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
            }}>
              🍖
            </div>
          )}
        </div>

        <div className="item-detail-info">
          <div className="item-detail-category">
            {categoryLabels[item.category] || item.category}
          </div>
          <h1>{item.name}</h1>
          <div className="item-detail-price">₱{parseFloat(item.price).toFixed(2)}</div>
          <p className="item-detail-desc">{item.description}</p>

          <div className="item-qty-selector">
            <label>Quantity:</label>
            <div className="cart-item-qty">
              <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span style={{ fontSize: '1.1rem', fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Subtotal: <strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>
              ₱{(parseFloat(item.price) * quantity).toFixed(2)}
            </strong>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleAdd}
            style={{ minWidth: '200px' }}
          >
            {added ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
