const express = require('express');
const router = express.Router();
const passport = require('passport');
const { protect, admin } = require('../middlewares/authMiddleware');
const { register, registerAdmin, login, googleCallback } = require('../controllers/authController');

router.post('/register', register);
router.post('/register-admin', protect, admin, registerAdmin);
router.post('/login', login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleCallback);

module.exports = router;