import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function ReservationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/reservations/${id}`);
      setData(res.data);
      setForm({
        reservation_date: res.data.reservation.reservation_date?.split('T')[0] || '',
        reservation_time: res.data.reservation.reservation_time || '',
        guests: res.data.reservation.guests || '',
        table_preference: res.data.reservation.table_preference || 'any',
        notes: res.data.reservation.notes || '',
      });
    } catch (err) {
      console.error('Failed to fetch details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    const handle = (d) => {
      if (d.id === parseInt(id)) fetchDetails();
    };
    socket.on('reservation:update', handle);
    return () => socket.off('reservation:update', handle);
  }, [socket, id]);

  const updateStatus = async (status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update.');
    }
  };

  const saveChanges = async () => {
    try {
      await api.put(`/reservations/${id}`, { ...form, guests: parseInt(form.guests) });
      setEditing(false);
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save.');
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!data) return <div className="page-container"><div className="empty-state"><h3>Reservation Not Found</h3></div></div>;

  const { reservation: r, queue, seating } = data;

  return (
    <div className="page-container">
      <button className="btn btn-secondary btn-sm mb-2" onClick={() => navigate('/staff/reservations')}>
        ← Back to Reservations
      </button>

      <div className="page-header">
        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h1>Reservation #{r.id}</h1>
            <span className={`badge badge-${r.status}`} style={{ marginTop: '0.5rem' }}>{r.status}</span>
          </div>
          <div className="btn-group">
            {!editing && (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>Edit</button>
            )}
            {r.status === 'pending' && (
              <>
                <button className="btn btn-primary btn-sm" onClick={() => updateStatus('approved')}>Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => updateStatus('cancelled')}>Decline</button>
              </>
            )}
            {r.status === 'approved' && (
              <button className="btn btn-primary btn-sm" onClick={() => updateStatus('queued')}>Add to Queue</button>
            )}
            {r.status === 'queued' && (
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/staff/seating')}>Assign Table</button>
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
                <div className="detail-value">{r.customer_name}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Email</div>
                <div className="detail-value">{r.customer_email}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Phone</div>
                <div className="detail-value">{r.customer_phone || '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Info */}
        <div className="card">
          <div className="card-header"><h3 style={{ color: 'var(--color-primary)' }}>Reservation Details</h3></div>
          <div className="card-body">
            {editing ? (
              <div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-input" value={form.reservation_date} onChange={e => setForm(p => ({ ...p, reservation_date: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input type="time" className="form-input" value={form.reservation_time} onChange={e => setForm(p => ({ ...p, reservation_time: e.target.value }))} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Guests</label>
                    <input type="number" className="form-input" value={form.guests} onChange={e => setForm(p => ({ ...p, guests: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preference</label>
                    <select className="form-select" value={form.table_preference} onChange={e => setForm(p => ({ ...p, table_preference: e.target.value }))}>
                      <option value="any">Any</option>
                      <option value="main">Main</option>
                      <option value="bar">Bar</option>
                      <option value="billiards">Billiards</option>
                      <option value="ktv">KTV</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} />
                </div>
                <div className="btn-group">
                  <button className="btn btn-primary btn-sm" onClick={saveChanges}>Save Changes</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Date</div>
                  <div className="detail-value">{formatDate(r.reservation_date)}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Time</div>
                  <div className="detail-value">{formatTime(r.reservation_time)}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Guests</div>
                  <div className="detail-value">{r.guests}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Preference</div>
                  <div className="detail-value" style={{ textTransform: 'capitalize' }}>{r.table_preference}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Table</div>
                  <div className="detail-value">{r.table_number || 'Not assigned'}</div>
                </div>
                {r.notes && (
                  <div className="detail-item detail-full">
                    <div className="detail-label">Notes</div>
                    <div className="detail-value">{r.notes}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Queue Info */}
        {queue && (
          <div className="card">
            <div className="card-header"><h3 style={{ color: 'var(--color-primary)' }}>Queue Information</h3></div>
            <div className="card-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Queue Number</div>
                  <div className="detail-value" style={{ fontSize: '1.5rem', color: 'var(--color-primary)', fontWeight: '700' }}>{queue.queue_number}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Position</div>
                  <div className="detail-value">{queue.position}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Queue Status</div>
                  <div className="detail-value"><span className={`badge badge-${queue.status}`}>{queue.status}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Seating Info */}
        {seating && (
          <div className="card">
            <div className="card-header"><h3 style={{ color: 'var(--color-primary)' }}>Seating Information</h3></div>
            <div className="card-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Table</div>
                  <div className="detail-value">{seating.table_number} ({seating.area})</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Seated At</div>
                  <div className="detail-value">{new Date(seating.seated_at).toLocaleString()}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Status</div>
                  <div className="detail-value"><span className={`badge badge-${seating.status}`}>{seating.status}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
