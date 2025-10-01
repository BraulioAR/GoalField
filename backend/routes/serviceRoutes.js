const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { getServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const { upload } = require('../config/cloudinary');

// GET all services (public)
router.get('/', getServices);

// GET single service by ID (public)
router.get('/:id', getServiceById);

// CREATE service with image upload (admin only)
router.post('/', protect, admin, upload.single('image'), createService);

// UPDATE service with optional image upload (admin only)
router.put('/:id', protect, admin, upload.single('image'), updateService);

// DELETE service (admin only)
router.delete('/:id', protect, admin, deleteService);

module.exports = router;