const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Joi = require('joi');
const io = require('../server').io;

exports.createBooking = async (req, res) => {
  const schema = Joi.object({
    service: Joi.string().required(),
    dateTime: Joi.date().iso().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Verify service exists
    const service = await Service.findById(req.body.service);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = new Booking({
      user: req.user._id,
      service: req.body.service,
      dateTime: req.body.dateTime,
    });

    await booking.save();
    const populatedBooking = await Booking.findById(booking._id).populate('service');
    if (io) {
      io.emit('newBooking', populatedBooking);
    } else {
      console.warn('Socket.io not initialized, skipping emit');
    }
    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.updateBooking = async (req, res) => {
  const schema = Joi.object({
    dateTime: Joi.date().iso().optional(),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled').optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    let booking;

    if (req.user.role === 'admin') {
      // Admins can update any booking
      booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).populate('service user');
    } else {
      // Regular users can only update their own bookings
      booking = await Booking.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { $set: req.body },
        { new: true, runValidators: true }
      ).populate('service');
    }

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }

    if (io) {
      io.emit('updateBooking', booking);
    } else {
      console.warn('Socket.io not initialized, skipping emit');
    }
    res.json(booking);
  } catch (err) {
    console.error('Booking update error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }
    if (io) {
      io.emit('deleteBooking', { id: req.params.id });
    } else {
      console.warn('Socket.io not initialized, skipping emit');
    }
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    console.error('Booking deletion error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};
