const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reservationSchema = new Schema({
 user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
 business: [{ type: Schema.Types.ObjectId, ref: 'Barraca' }],
 products: {
   cadeira: {
     //price is here as a test
     price: { type: Number, default: 0 },
     amount: { type: Number, default: 0 },
   },
   barraca: {
     //price is here as a test
     price: { type: Number, default: 0 },
     amount: { type: Number, default: 0 },
   },
 },
 total: { type: Number, default: 0 },
}, {
   timestamps: {
     createdAt: 'created_at',
     updatedAt: 'updated_at',
   },
 });
const Reserva = mongoose.model('Reserva', reservationSchema);
module.exports = Reserva;
