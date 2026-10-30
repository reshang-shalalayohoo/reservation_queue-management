import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import EmptyState from '../../components/common/EmptyState';

export default function SeatingManagement() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [seating, setSeating] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const socket = useSocket();

  const fetchData = async () => {
    try {
      const [resRes, tabRes, seatRes] = await Promise.all([
        api.get('/reservations'),
        api.get('/tables'),
        api.get('/seating'),
      ]);
      setReservations(resRes.data.reservations.filter(r =>
        r.status === 'queued' || r.status === 'approved'
      ));
      setTables(tabRes.data.tables);
      setSeating(seatRes.data.seating);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handle = () => fetchData();
    socket.on('reservation:update', handle);
    socket.on('reservation:new', handle);
    socket.on('table:update', handle);
    socket.on('seating:update', handle);
    socket.on('queue:update', handle);
    return () => {
      socket.off('reservation:update', handle);
      socket.off('reservation:new', handle);
      socket.off('table:update', handle);
      socket.off('seating:update', handle);
      socket.off('queue:update', handle);
    };
  }, [socket]);

  const assignTable = async (tableId) => {
    if (!selectedReservation) return;
    try {
      await api.post('/seating', {
        reservation_id: selectedReservation.id,
        table_id: tableId,
      });
      setSelectedReservation(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign table.');
    }
  };

  const finishSeating = async (seatingId) => {
    try {
      await api.put(`/seating/${seatingId}/finish`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to finish seating.');
    }
  };

  const availableTables = tables.filter(t => t.status === 'available');
  const activeSeating = seating.filter(s => s.status === 'seated');

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Seating Management</h1>
        <p>Assign customers to available tables</p>
        <div className="accent-line"></div>
      </div>

      <div className="seating-layout">
        {/* Waiting Customers */}
        <div className="seating-panel">
          <div className="seating-panel-header">
            Waiting Customers ({reservations.length})
          </div>
          <div className="seating-panel-body">
            {reservations.length === 0 ? (
              <EmptyState
                illustration="waitingChairs"
                title="No customers waiting"
                description="Customers awaiting seating will appear here."
                variant="inline"
              />
            ) : (
              reservations.map(r => (
                <div
                  key={r.id}
                  className="seating-item"
                  style={{
                    cursor: 'pointer',
                    padding: '0.85rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedReservation?.id === r.id ? 'rgba(139,26,26,0.12)' : 'transparent',
                    border: selectedReservation?.id === r.id ? '1px solid var(--color-primary)' : '1px solid transparent',
                  }}
                  onClick={() => setSelectedReservation(selectedReservation?.id === r.id ? null : r)}
                >
                  <div>
                    <div style={{ fontWeight: '600' }}>{r.customer_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {r.guests} guests • {r.table_preference} • {formatTime(r.reservation_time)}
                    </div>
                  </div>
                  <span className={`badge badge-${r.status}`}>{r.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Available Tables */}
        <div className="seating-panel">
          <div className="seating-panel-header">
            Available Tables ({availableTables.length})
            {selectedReservation && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '400' }}>
                — Select a table for {selectedReservation.customer_name}
              </span>
            )}
          </div>
          <div className="seating-panel-body">
            {availableTables.length === 0 ? (
              <EmptyState
                illustration="restaurantTable"
                title="No tables available"
                description="All tables are currently occupied or reserved."
                variant="inline"
              />
            ) : (
              <div className="table-visual-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                {availableTables.map(table => (
                  <div
                    key={table.id}
                    className="table-visual-card available"
                    onClick={() => selectedReservation && assignTable(table.id)}
                    style={{
                      cursor: selectedReservation ? 'pointer' : 'default',
                      opacity: selectedReservation ? 1 : 0.7,
                    }}
                  >
                    <div className="table-num">{table.table_number}</div>
                    <div className="table-cap">{table.capacity} seats</div>
                    <div className="table-area-tag">{table.area}</div>
                    {selectedReservation && (
                      <button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem', fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
                        Assign
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Currently Seated */}
      {activeSeating.length > 0 ? (
        <div className="card mt-3">
          <div className="card-header">
            <h3>Currently Seated ({activeSeating.length})</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Area</th>
                  <th>Guests</th>
                  <th>Seated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeSeating.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: '500' }}>{s.customer_name}</td>
                    <td>{s.table_number}</td>
                    <td style={{ textTransform: 'capitalize' }}>{s.area}</td>
                    <td>{s.guests}</td>
                    <td>{new Date(s.seated_at).toLocaleTimeString()}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => finishSeating(s.id)}>
                        Finish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card mt-3">
          <div className="card-header">
            <h3>Currently Seated (0)</h3>
          </div>
          <div className="card-body">
            <EmptyState
              illustration="seating"
              title="No seating assignments yet."
              description="Assign waiting customers to available tables to seat them."
              variant="card"
            />
          </div>
        </div>
      )}
    </div>
  );
}
