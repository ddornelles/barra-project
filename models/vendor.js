const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  confirmedEmail: {
    type: Boolean,
    default: false,
  },
  code: { type: String, unique: true, required: true },
  confirmationCode: { type: String, unique: true },
  password: { type: String, required: true },
  imgName: { type: String, default: 'profilePic' },
  imgPath: { type: String, default: 'https://image.flaticon.com/icons/svg/119/119596.svg' },
  role: {
    type: String,
    enum: ['VENDOR', 'PREMIUM-VENDOR'],
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