const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productsSchema = new Schema({
  business: [{ type: Schema.Types.ObjectId, ref: 'Barraca'}],
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
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});
const Products = mongoose.model('Products', productsSchema);
module.exports = Products;