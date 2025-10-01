const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: 'User exists' });

    user = new User(req.body);
    await user.save();
    res.status(201).json({ token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.registerAdmin = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: 'User exists' });

    user = new User({ ...req.body, role: 'admin' });
    await user.save();
    res.status(201).json({ token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({ token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

exports.googleCallback = (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`/auth/success?token=${token}`);
};