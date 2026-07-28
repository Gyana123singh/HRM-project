const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    default: 'Epic Corporation Inc.'
  },
  taxId: {
    type: String,
    trim: true,
    default: 'TAX-99882211-US'
  },
  email: {
    type: String,
    required: true,
    trim: true,
    default: 'hr@epiccorp.com'
  },
  phone: {
    type: String,
    trim: true,
    default: '+1 (555) 234-5678'
  },
  website: {
    type: String,
    trim: true,
    default: 'https://epiccorp.global'
  },
  currency: {
    type: String,
    default: 'USD ($)'
  },
  address: {
    type: String,
    default: '100 Innovation Boulevard, Tech Park Tower A, Suite 500, San Francisco, CA'
  },
  logo: {
    type: String,
    default: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80'
  },
  fiscalYear: {
    type: String,
    default: '2026-2027'
  }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
