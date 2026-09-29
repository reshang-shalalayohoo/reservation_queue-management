import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

export default function QueueStatus() {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchQueue = async () => {
    try {
      const res = await api.get('/queue/my');
      setQueueData(res.data);
    } catch (err) {
      console.error('Failed to fetch queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Real-time queue updates
  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdate = () => {
      fetchQueue();
    };

    socket.on('queue:update', handleQueueUpdate);
    socket.on('reservation:update', handleQueueUpdate);

    return () => {
      socket.off('queue:update', handleQueueUpdate);
      socket.off('reservation:update', handleQueueUpdate);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="loading-container"><div className="spinner"></div><p className="loading-text">Loading queue status...</p></div>
    );
  }

  if (!queueData?.queue) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Queue Status</h1>
          <p>Track your position in the queue</p>
          <div className="accent-line"></div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Not in Queue</h3>
          <p>You don't have an active queue entry. Once your reservation is approved and queued, your position will appear here.</p>
        </div>
      </div>
    );
  }

  const { queue, totalWaiting, peopleAhead } = queueData;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Queue Status</h1>
        <p>Track your position in the queue</p>
        <div className="accent-line"></div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="queue-display">
            <div className="queue-label">Your Queue Number</div>
            <div className="queue-number">{queue.queue_number}</div>

            {queue.status === 'called' ? (
              <div style={{ marginTop: '0.5rem' }}>
                <span className="badge badge-called" style={{ fontSize: '0.9rem', padding: '0.4rem 1.2rem' }}>
                  ✨ You've Been Called!
                </span>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1rem' }}>
                  Please proceed to the host stand
                </p>
              </div>
            ) : queue.status === 'seated' ? (
              <div style={{ marginTop: '0.5rem' }}>
                <span className="badge badge-seated" style={{ fontSize: '0.9rem', padding: '0.4rem 1.2rem' }}>
                  ✅ Seated
                </span>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1rem' }}>
                  Enjoy your meal!
                </p>
              </div>
            ) : (
              <div className="queue-position-text">
                <strong>{peopleAhead}</strong> {peopleAhead === 1 ? 'person' : 'people'} ahead of you
              </div>
            )}
          </div>

          <div className="queue-info-grid">
            <div className="queue-info-item">
              <div className="info-label">Position</div>
              <div className="info-value">{queue.position}</div>
            </div>
            <div className="queue-info-item">
              <div className="info-label">Status</div>
              <div className="info-value" style={{ textTransform: 'capitalize' }}>{queue.status}</div>
            </div>
            <div className="queue-info-item">
              <div className="info-label">Total Waiting</div>
              <div className="info-value">{totalWaiting}</div>
            </div>
            <div className="queue-info-item">
              <div className="info-label">Guests</div>
              <div className="info-value">{queue.guests}</div>
            </div>
          </div>
        </div>
      </div>

      {queue.status === 'waiting' && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          <span className="animate-pulse">⏳</span> This page updates automatically. Please wait for your number to be called.
        </div>
      )}
    </div>
  );
}
