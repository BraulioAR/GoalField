const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');
const Booking = require('../models/Booking');

// @desc    Get bookings (user-specific for regular users, all for admins)
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      // For admins: fetch all bookings with populated service and user details
      bookings = await Booking.find().populate('service user');
    } else {
      // For regular users: fetch only their bookings with populated service
      bookings = await Booking.find({ user: req.user._id }).populate('service');
    }
    res.json(bookings);
  } catch (err) {
    console.error('Bookings fetch error:', err);
    res.status(500).json({ message: err.message });
  }
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, createBooking);

// @desc    Update existing booking
// @route   PUT /api/bookings/:id
// @access  Private (users update their own / admins update any)
router.put('/:id', protect, updateBooking);

// @desc    Delete existing booking
// @route   DELETE /api/bookings/:id
// @access  Private
router.delete('/:id', protect, deleteBooking);

module.exports = router;
