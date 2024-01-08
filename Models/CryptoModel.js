import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema({
  coinID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
  },
  image: String,
}, {
  timestamps: true,
});

export default mongoose.model('Crypto', cryptoSchema);
