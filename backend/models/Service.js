const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please add a service name'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Please add a description'],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  duration: { 
    type: Number, 
    required: [true, 'Please add a duration'],
    min: [15, 'Duration must be at least 15 minutes']
  },
  imageUrl: { 
    type: String, 
    default: '' 
  },
  imagePublicId: { 
    type: String, 
    default: '' 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Service', serviceSchema);