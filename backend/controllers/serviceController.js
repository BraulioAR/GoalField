const Service = require('../models/Service');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    // Validar campos requeridos
    if (!name || !description || !price || !duration) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const serviceData = {
      name,
      description,
      price: Number(price),
      duration: Number(duration),
    };

    // Si se subió una imagen, agregar URL y public_id
    if (req.file) {
      serviceData.imageUrl = req.file.path;
      serviceData.imagePublicId = req.file.filename;
    }

    const service = new Service(serviceData);
    const newService = await service.save();
    
    res.status(201).json(newService);
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { name, description, price, duration } = req.body;

    // Actualizar campos básicos
    if (name) service.name = name;
    if (description) service.description = description;
    if (price) service.price = Number(price);
    if (duration) service.duration = Number(duration);

    // Si se subió una nueva imagen
    if (req.file) {
      // Eliminar imagen anterior de Cloudinary si existe
      if (service.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(service.imagePublicId);
        } catch (cloudinaryError) {
          console.error('Error deleting old image from Cloudinary:', cloudinaryError);
        }
      }
      
      // Actualizar con nueva imagen
      service.imageUrl = req.file.path;
      service.imagePublicId = req.file.filename;
    }

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Eliminar imagen de Cloudinary si existe
    if (service.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(service.imagePublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
      }
    }

    await service.deleteOne();
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ message: err.message });
  }
};