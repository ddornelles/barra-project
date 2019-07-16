const mongoose = require('mongoose');
const { Schema } = mongoose;

const barracaSchema = new Schema({
  name: { type: String, required: true, unique: true },
  location: { type: { type: String }, coordinates: [Number] },
  imgName: String,
  imgPath: { type: String, default: 'https://image.flaticon.com/icons/svg/452/452943.svg' },
  description: String,
  owner: Schema.Types.ObjectId,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const Barraca = mongoose.model('Barraca', barracaSchema);

module.exports = Barraca;