import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import EmptyState from '../../components/common/EmptyState';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (data) => {
      setReservations(prev =>
        prev.map(r => (r.id === data.id ? { ...r, ...data } : r))
      );
    };

    socket.on('reservation:update', handleUpdate);
    return () => socket.off('reservation:update', handleUpdate);
  }, [socket]);

  const cancelReservation = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      setReservations(prev =>
        prev.map(r => (r.id === id ? { ...r, status: 'cancelled' } : r))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel.');
    }
  };

  const getBadgeClass = (status) => `badge badge-${status}`;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const formatTime = (time) => {
    const [h, m] = time.split(':');
    const hr = parseInt(h);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    return `${hr % 12 || 12}:${m} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="loading-container"><div className="spinner"></div><p className="loading-text">Loading reservations...</p></div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1>My Reservations</h1>
            <p>View and manage your reservations</p>
            <div className="accent-line"></div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/reservation')}>
            + New Reservation
          </button>
        </div>
      </div>

      {reservations.length === 0 ? (
        <EmptyState
          illustration="calendar"
          title="No reservations yet."
          description="Your upcoming reservations will appear here once you make a booking."
          actionLabel="Make a Reservation"
          onAction={() => navigate('/reservation')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {reservations.map(r => (
            <div key={r.id} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div className="flex items-center gap-1 mb-1">
                      <span className={getBadgeClass(r.status)}>{r.status}</span>
                      {r.table_number && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          • Table {r.table_number}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                      {formatDate(r.reservation_date)} at {formatTime(r.reservation_time)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {r.guests} guest{r.guests !== 1 ? 's' : ''} • {r.table_preference === 'any' ? 'No preference' : r.table_preference} area
                    </div>
                    {r.notes && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                        "{r.notes}"
                      </div>
                    )}
                  </div>
                  <div className="btn-group">
                    {(r.status === 'pending' || r.status === 'approved') && (
                      <button className="btn btn-danger btn-sm" onClick={() => cancelReservation(r.id)}>
                        Cancel
                      </button>
                    )}
                    {(r.status === 'queued' || r.status === 'approved') && (
                      <button className="btn btn-outline btn-sm" onClick={() => navigate('/queue-status')}>
                        Queue Status
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
