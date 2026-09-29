import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const categoryLabels = {
  all: 'All',
  grill: 'Grill',
  main_course: 'Main Course',
  appetizer: 'Appetizer',
  beverage: 'Beverage',
  dessert: 'Dessert',
  bar_snack: 'Bar Snack',
};

export default function DigitalMenu() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get('/menu');
        setItems(res.data.items);
      } catch (err) {
        console.error('Failed to fetch menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = filter === 'all'
    ? items
    : items.filter(i => i.category === filter);

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addItem(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  // Get available categories from menu items
  const availableCategories = ['all', ...new Set(items.map(i => i.category))];

  if (loading) {
    return (
      <div className="loading-container"><div className="spinner"></div><p className="loading-text">Loading menu...</p></div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Digital Menu</h1>
        <p>Explore our selection of food and beverages</p>
        <div className="accent-line"></div>
      </div>

      <div className="menu-filters">
        {availableCategories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No Items Found</h3>
          <p>Try selecting a different category.</p>
        </div>
      ) : (
        <div className="menu-grid">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="menu-card"
              onClick={() => navigate(`/menu/${item.id}`)}
            >
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="menu-card-image" loading="lazy" />
              ) : (
                <div className="menu-card-image-placeholder">🍖</div>
              )}
              <div className="menu-card-info">
                <div className="menu-card-category">{categoryLabels[item.category] || item.category}</div>
                <div className="menu-card-name">{item.name}</div>
                <div className="menu-card-desc">{item.description}</div>
                <div className="menu-card-footer">
                  <span className="menu-card-price">₱{parseFloat(item.price).toFixed(2)}</span>
                  <button
                    className={`btn btn-primary btn-sm`}
                    onClick={(e) => handleAddToCart(e, item)}
                    style={addedId === item.id ? { backgroundColor: 'var(--color-primary-dark)' } : {}}
                  >
                    {addedId === item.id ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
