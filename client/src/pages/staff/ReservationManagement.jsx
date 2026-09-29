import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const socket = useSocket();
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations');
      setReservations(res.data.reservations);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handle = () => fetchReservations();
    socket.on('reservation:new', handle);
    socket.on('reservation:update', handle);
    return () => {
      socket.off('reservation:new', handle);
      socket.off('reservation:update', handle);
    };
  }, [socket]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      setReservations(prev =>
        prev.map(r => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status.');
    }
  };

  const filtered = filter === 'all'
    ? reservations
    : reservations.filter(r => r.status === filter);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatTime = (t) => {
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  const getBadgeClass = (s) => `badge badge-${s}`;

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p className="loading-text">Loading...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Reservation Management</h1>
        <p>View and manage customer reservations</p>
        <div className="accent-line"></div>
      </div>

      <div className="menu-filters mb-2">
        {['all', 'pending', 'approved', 'queued', 'seated', 'completed', 'cancelled'].map(s => (
          <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== 'all' && (
              <span style={{ marginLeft: '0.3rem', opacity: 0.7 }}>
                ({reservations.filter(r => r.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Reservations Found</h3>
          <p>No reservations match the selected filter.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Preference</th>
                <th>Table</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>
                    <div style={{ fontWeight: '500' }}>{r.customer_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.customer_phone}</div>
                  </td>
                  <td>{formatDate(r.reservation_date)}</td>
                  <td>{formatTime(r.reservation_time)}</td>
                  <td>{r.guests}</td>
                  <td style={{ textTransform: 'capitalize' }}>{r.table_preference}</td>
                  <td>{r.table_number || '—'}</td>
                  <td><span className={getBadgeClass(r.status)}>{r.status}</span></td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-outline btn-sm" onClick={() => navigate(`/staff/reservations/${r.id}`)}>
                        View
                      </button>
                      {r.status === 'pending' && (
                        <>
                          <button className="btn btn-primary btn-sm" onClick={() => updateStatus(r.id, 'approved')}>
                            Approve
                          </button>
                          <button className="btn btn-sm" style={{ color: '#999', border: '1px solid #444', background: 'transparent' }} onClick={() => updateStatus(r.id, 'cancelled')}>
                            Decline
                          </button>
                        </>
                      )}
                      {r.status === 'approved' && (
                        <button className="btn btn-primary btn-sm" onClick={() => updateStatus(r.id, 'queued')}>
                          Add to Queue
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
