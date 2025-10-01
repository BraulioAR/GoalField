const User = require('../models/User');
const Joi = require('joi');

exports.getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

exports.updateMe = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    password: Joi.string().min(6).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await require('bcryptjs').hash(updates.password, 12);
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};