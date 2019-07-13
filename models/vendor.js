const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
  status: {
    type: Boolean,
    default: false,
  },
  confirmationCode: { type: String, unique: true },
  identification: { type: String, unique: true },
  email: { type: String, unique: true },
  role: {
    type: String,
    default: 'VENDOR',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;