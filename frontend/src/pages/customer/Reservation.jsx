import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Reservation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    reservation_date: '',
    reservation_time: '',
    guests: '',
    table_preference: 'any',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/reservations', {
        ...form,
        guests: parseInt(form.guests),
      });
      navigate('/my-reservations');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create reservation.');
    } finally {
      setLoading(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Make a Reservation</h1>
        <p>Reserve your table at Viking Grill</p>
        <div className="accent-line"></div>
      </div>

      <div style={{ maxWidth: '640px' }}>
        <div className="card">
          <div className="card-header">
            <h3>Reservation Details</h3>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-error">⚠ {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="res-date">Reservation Date *</label>
                  <input
                    id="res-date"
                    name="reservation_date"
                    type="date"
                    className="form-input"
                    min={today}
                    value={form.reservation_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="res-time">Reservation Time *</label>
                  <input
                    id="res-time"
                    name="reservation_time"
                    type="time"
                    className="form-input"
                    value={form.reservation_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="res-guests">Number of Guests *</label>
                  <input
                    id="res-guests"
                    name="guests"
                    type="number"
                    className="form-input"
                    min="1"
                    max="20"
                    placeholder="How many guests?"
                    value={form.guests}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="res-pref">Table Preference</label>
                  <select
                    id="res-pref"
                    name="table_preference"
                    className="form-select"
                    value={form.table_preference}
                    onChange={handleChange}
                  >
                    <option value="any">No Preference</option>
                    <option value="main">Main Dining</option>
                    <option value="bar">Bar Area</option>
                    <option value="billiards">Billiards Area</option>
                    <option value="ktv">KTV Room</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="res-notes">Special Requests</label>
                <textarea
                  id="res-notes"
                  name="notes"
                  className="form-textarea"
                  placeholder="Any special requests or occasions?"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Reservation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
