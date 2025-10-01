const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');
const Booking = require('../models/Booking');

router.get('/', protect, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.find().populate('service user');
    } else {
      bookings = await Booking.find({ user: req.user._id }).populate('service');
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', protect, createBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;