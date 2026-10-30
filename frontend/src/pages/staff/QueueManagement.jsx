import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import EmptyState from '../../components/common/EmptyState';

export default function QueueManagement() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchQueue = async () => {
    try {
      const res = await api.get('/queue');
      setQueue(res.data.queue);
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handle = () => fetchQueue();
    socket.on('queue:update', handle);
    socket.on('reservation:update', handle);
    return () => {
      socket.off('queue:update', handle);
      socket.off('reservation:update', handle);
    };
  }, [socket]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/queue/${id}/status`, { status });
      fetchQueue();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update.');
    }
  };

  const updatePosition = async (id, position) => {
    try {
      await api.put(`/queue/${id}/position`, { position });
      fetchQueue();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update position.');
    }
  };

  const moveUp = (entry) => {
    if (entry.position <= 1) return;
    updatePosition(entry.id, entry.position - 1);
  };

  const moveDown = (entry) => {
    updatePosition(entry.id, entry.position + 1);
  };

  const activeQueue = queue.filter(q => q.status === 'waiting' || q.status === 'called');
  const pastQueue = queue.filter(q => q.status !== 'waiting' && q.status !== 'called');

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Queue Management</h1>
        <p>Manage waiting customers and queue positions</p>
        <div className="accent-line"></div>
      </div>

      {/* Stats */}
      <div className="dashboard-grid mb-2">
        <div className="stat-card">
          <div className="stat-label">Waiting</div>
          <div className="stat-number">{queue.filter(q => q.status === 'waiting').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Called</div>
          <div className="stat-number">{queue.filter(q => q.status === 'called').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Seated Today</div>
          <div className="stat-number">{queue.filter(q => q.status === 'seated').length}</div>
        </div>
      </div>

      {/* Active Queue */}
      <div className="card mb-2">
        <div className="card-header">
          <h3>Active Queue</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{activeQueue.length} entries</span>
        </div>
        {activeQueue.length === 0 ? (
          <div className="card-body">
            <EmptyState
              illustration="waitingChairs"
              title="No customers in the queue."
              description="Customers will appear here once their reservations are queued."
              variant="card"
            />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Queue #</th>
                  <th>Position</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Guests</th>
                  <th>Preference</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeQueue.map(entry => (
                  <tr key={entry.id}>
                    <td>
                      <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                        {entry.queue_number}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="qty-btn" onClick={() => moveUp(entry)} disabled={entry.position <= 1} title="Move up">↑</button>
                        <span style={{ fontWeight: '600', minWidth: '24px', textAlign: 'center' }}>{entry.position}</span>
                        <button className="qty-btn" onClick={() => moveDown(entry)} title="Move down">↓</button>
                      </div>
                    </td>
                    <td style={{ fontWeight: '500' }}>{entry.customer_name}</td>
                    <td>{entry.customer_phone || '—'}</td>
                    <td>{entry.guests}</td>
                    <td style={{ textTransform: 'capitalize' }}>{entry.table_preference}</td>
                    <td><span className={`badge badge-${entry.status}`}>{entry.status}</span></td>
                    <td>
                      <div className="actions">
                        {entry.status === 'waiting' && (
                          <button className="btn btn-primary btn-sm" onClick={() => updateStatus(entry.id, 'called')}>Call</button>
                        )}
                        {entry.status === 'called' && (
                          <button className="btn btn-primary btn-sm" onClick={() => updateStatus(entry.id, 'seated')}>Seat</button>
                        )}
                        <button className="btn btn-sm" style={{ color: '#999', border: '1px solid #444', background: 'transparent' }} onClick={() => updateStatus(entry.id, 'no_show')}>No Show</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Past Queue */}
      {pastQueue.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>Past Entries</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Queue #</th>
                  <th>Customer</th>
                  <th>Guests</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pastQueue.slice(0, 20).map(entry => (
                  <tr key={entry.id}>
                    <td style={{ fontWeight: '600' }}>{entry.queue_number}</td>
                    <td>{entry.customer_name}</td>
                    <td>{entry.guests}</td>
                    <td><span className={`badge badge-${entry.status}`}>{entry.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
