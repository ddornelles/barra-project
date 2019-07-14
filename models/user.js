const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  confirmedEmail: {
    type: Boolean,
    default: false,
  },
  confirmationCode: { type: String, unique: true },
  password: String,
  profilePicture: {
    name: { type: String, default: 'profilePic' },
    path: { type: String, default: 'https://image.flaticon.com/icons/svg/119/119596.svg' },
  },
  role: {
    type: String,
    enum: ['CLIENT', 'PREMIUM'],
    default: 'CLIENT',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;