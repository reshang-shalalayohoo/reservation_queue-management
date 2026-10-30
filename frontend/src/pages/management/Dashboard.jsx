import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import EmptyState from '../../components/common/EmptyState';

const statusLabels = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handle = () => fetchStats();
    socket.on('reservation:new', handle);
    socket.on('reservation:update', handle);
    socket.on('queue:update', handle);
    socket.on('table:update', handle);
    socket.on('seating:update', handle);
    socket.on('order:new', handle);
    socket.on('order:update', handle);
    return () => {
      socket.off('reservation:new', handle);
      socket.off('reservation:update', handle);
      socket.off('queue:update', handle);
      socket.off('table:update', handle);
      socket.off('seating:update', handle);
      socket.off('order:new', handle);
      socket.off('order:update', handle);
    };
  }, [socket]);

  const formatDate = (d) => new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  });

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  if (!stats) return (
    <div className="page-container">
      <EmptyState
        illustration="dashboard"
        title="Failed to load dashboard"
        description="Unable to retrieve dashboard data. Please try refreshing the page."
        actionLabel="Retry"
        onAction={() => { setLoading(true); fetchStats(); }}
      />
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Management Dashboard</h1>
        <p>Overview of reservations, queues, tables, and orders</p>
        <div className="accent-line"></div>
      </div>

      {/* Main Stats */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Today's Reservations</div>
          <div className="stat-number">{stats.reservations.today}</div>
          <div className="stat-sub">{stats.reservations.pending} pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Queue Waiting</div>
          <div className="stat-number">{stats.queue.waiting}</div>
          <div className="stat-sub">{stats.queue.called} called</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tables Available</div>
          <div className="stat-number">{stats.tables.available}</div>
          <div className="stat-sub">of {stats.tables.total} total</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Currently Seated</div>
          <div className="stat-number">{stats.seating.currentlySeated}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Orders</div>
          <div className="stat-number">{stats.orders.pending + stats.orders.preparing}</div>
          <div className="stat-sub">{stats.orders.ready} ready for pickup</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Today's Revenue</div>
          <div className="stat-number" style={{ fontSize: '1.5rem' }}>₱{parseFloat(stats.orders.todayRevenue).toFixed(0)}</div>
          <div className="stat-sub">{stats.orders.total} total orders</div>
        </div>
      </div>

      {/* Tables by Area */}
      <div className="card mb-2">
        <div className="card-header"><h3 style={{ color: 'var(--color-primary)' }}>Table Availability by Area</h3></div>
        {stats.tables.byArea && stats.tables.byArea.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th style={{ textAlign: 'center' }}>Total</th>
                  <th style={{ textAlign: 'center' }}>Available</th>
                  <th style={{ textAlign: 'center' }}>Occupied</th>
                  <th style={{ textAlign: 'center' }}>Reserved</th>
                  <th style={{ textAlign: 'center' }}>Maintenance</th>
                </tr>
              </thead>
              <tbody>
                {stats.tables.byArea.map(area => (
                  <tr key={area.area}>
                    <td style={{ fontWeight: '600', textTransform: 'capitalize' }}>{area.area}</td>
                    <td style={{ textAlign: 'center' }}>{area.total}</td>
                    <td style={{ textAlign: 'center' }}>{area.available}</td>
                    <td style={{ textAlign: 'center', color: area.occupied > 0 ? 'var(--color-primary)' : '' }}>{area.occupied}</td>
                    <td style={{ textAlign: 'center' }}>{area.reserved}</td>
                    <td style={{ textAlign: 'center' }}>{area.maintenance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            illustration="restaurantTable"
            title="No table data available"
            description="Table area information will appear here once tables are configured."
            variant="compact"
          />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Recent Reservations */}
        <div className="card">
          <div className="card-header"><h3 style={{ color: 'var(--color-primary)' }}>Recent Reservations</h3></div>
          {stats.recentReservations && stats.recentReservations.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Table</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentReservations.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: '500' }}>{r.customer_name}</td>
                      <td>{r.table_number || '—'}</td>
                      <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDate(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              illustration="calendar"
              title="No reservations yet"
              description="Recent reservations will appear here."
              variant="compact"
            />
          )}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="card-header"><h3 style={{ color: 'var(--color-primary)' }}>Recent Orders</h3></div>
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: '700', color: 'var(--color-primary)' }}>#{o.id}</td>
                      <td>{o.customer_name}</td>
                      <td style={{ fontWeight: '600' }}>₱{parseFloat(o.total).toFixed(2)}</td>
                      <td><span className={`badge badge-${o.status}`}>{statusLabels[o.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              illustration="orderBoard"
              title="No orders yet"
              description="Recent orders will appear here."
              variant="compact"
            />
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <span className="animate-pulse">📊</span> Dashboard updates in real-time
      </div>
    </div>
  );
}
