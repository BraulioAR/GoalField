const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { getUsers, getMe, updateMe } = require('../controllers/userController');

router.get('/', protect, admin, getUsers);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;