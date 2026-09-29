import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ table_number: '', capacity: '', area: 'main' });
  const [filter, setFilter] = useState('all');
  const socket = useSocket();

  const fetchTables = async () => {
    try {
      const res = await api.get('/tables');
      setTables(res.data.tables);
    } catch (err) {
      console.error('Failed to fetch tables:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handle = () => fetchTables();
    socket.on('table:update', handle);
    socket.on('table:deleted', handle);
    return () => {
      socket.off('table:update', handle);
      socket.off('table:deleted', handle);
    };
  }, [socket]);

  const updateTableStatus = async (id, status) => {
    try {
      await api.put(`/tables/${id}/status`, { status });
      fetchTables();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update.');
    }
  };

  const addTable = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tables', {
        ...addForm,
        capacity: parseInt(addForm.capacity),
      });
      setShowAdd(false);
      setAddForm({ table_number: '', capacity: '', area: 'main' });
      fetchTables();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add table.');
    }
  };

  const filteredTables = filter === 'all'
    ? tables
    : tables.filter(t => t.area === filter);

  const areas = ['all', ...new Set(tables.map(t => t.area))];

  const statusCounts = {
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    maintenance: tables.filter(t => t.status === 'maintenance').length,
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1>Table Management</h1>
            <p>Manage restaurant table availability</p>
            <div className="accent-line"></div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? '✕ Cancel' : '+ Add Table'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-grid mb-2">
        <div className="stat-card">
          <div className="stat-label">Available</div>
          <div className="stat-number">{statusCounts.available}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Occupied</div>
          <div className="stat-number">{statusCounts.occupied}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Reserved</div>
          <div className="stat-number">{statusCounts.reserved}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Maintenance</div>
          <div className="stat-number">{statusCounts.maintenance}</div>
        </div>
      </div>

      {/* Add Table Form */}
      {showAdd && (
        <div className="card mb-2">
          <div className="card-header"><h3>Add New Table</h3></div>
          <div className="card-body">
            <form onSubmit={addTable}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Table Number</label>
                  <input className="form-input" placeholder="e.g., M7" value={addForm.table_number} onChange={e => setAddForm(p => ({ ...p, table_number: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input className="form-input" type="number" min="1" placeholder="Seats" value={addForm.capacity} onChange={e => setAddForm(p => ({ ...p, capacity: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Area</label>
                  <select className="form-select" value={addForm.area} onChange={e => setAddForm(p => ({ ...p, area: e.target.value }))}>
                    <option value="main">Main</option>
                    <option value="bar">Bar</option>
                    <option value="billiards">Billiards</option>
                    <option value="ktv">KTV</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Add Table</button>
            </form>
          </div>
        </div>
      )}

      {/* Area Filter */}
      <div className="menu-filters mb-2">
        {areas.map(a => (
          <button key={a} className={`filter-btn ${filter === a ? 'active' : ''}`} onClick={() => setFilter(a)}>
            {a === 'all' ? 'All Areas' : a.charAt(0).toUpperCase() + a.slice(1)}
          </button>
        ))}
      </div>

      {/* Table Grid */}
      <div className="table-visual-grid">
        {filteredTables.map(table => (
          <div key={table.id} className={`table-visual-card ${table.status}`}>
            <div className="table-num">{table.table_number}</div>
            <div className="table-cap">{table.capacity} seats</div>
            <div className="table-area-tag">{table.area}</div>
            <div className="table-status-tag">{table.status}</div>
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {table.status === 'available' && (
                <>
                  <button className="btn btn-sm btn-outline" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }} onClick={() => updateTableStatus(table.id, 'reserved')}>Reserve</button>
                  <button className="btn btn-sm" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', color: '#999', border: '1px solid #444', background: 'transparent' }} onClick={() => updateTableStatus(table.id, 'maintenance')}>Maint.</button>
                </>
              )}
              {table.status === 'occupied' && (
                <button className="btn btn-sm btn-outline" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }} onClick={() => updateTableStatus(table.id, 'available')}>Free</button>
              )}
              {table.status === 'reserved' && (
                <button className="btn btn-sm btn-outline" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }} onClick={() => updateTableStatus(table.id, 'available')}>Unreserve</button>
              )}
              {table.status === 'maintenance' && (
                <button className="btn btn-sm btn-outline" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }} onClick={() => updateTableStatus(table.id, 'available')}>Activate</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>◻ Available</span>
        <span style={{ color: 'var(--color-primary)' }}>◼ Occupied</span>
        <span>◻ Reserved</span>
        <span style={{ opacity: 0.5 }}>◻ Maintenance</span>
      </div>
    </div>
  );
}
