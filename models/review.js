const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
 user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
 business: [{ type: Schema.Types.ObjectId, ref: 'Barraca' }],
 text: { type: String, required: true },
}, {
 timestamps: {
   createdAt: 'created_at',
   updatedAt: 'updated_at',
 },
});
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;