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
  promotionalEmail: { type: String, enum: ['off', 'on'], default: 'off' },
  password: { type: String, required: true },
  imgName: { type: String, default: 'profilePic' },
  imgPath: { type: String, default: 'https://image.flaticon.com/icons/svg/119/119596.svg' },
  cpf: { type: String, default: '123'},
  role: {
    type: String,
    enum: ['CLIENT', 'PREMIUM', 'VENDOR'],
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