import { useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('https://goalfield.onrender.com');

const BookingForm = ({ serviceId }) => {
  const [dateTime, setDateTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/bookings', { service: serviceId, dateTime }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Success
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
      <button type="submit">Book</button>
    </form>
  );
};

export default BookingForm;