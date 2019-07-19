const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
 name: { type: String, required: true },
 username: { type: String, unique: true, required: true },
 confirmedEmail: {
   type: Boolean,
   default: false,
 },
 age: { type: String, default: 'None' },
 contact: { type: String, default: '0 0000 0000' },
 title: { type: String, enum: ['Miss', 'Mr', 'Mrs', 'Ms', 'Mx', 'None'], default: 'None' },
 confirmationCode: { type: String, unique: true },
 promotionalEmail: { type: String, enum: ['off', 'on'], default: 'off' },
 password: { type: String, required: true },
 imgName: { type: String, default: 'profilePic' },
 imgPath: { type: String, default: 'https://image.flaticon.com/icons/svg/119/119596.svg' },
 cpf: { type: String, default: '000.000.000-00' },
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