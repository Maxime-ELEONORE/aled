import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    default: null,
  },
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    index: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Invalid email format.',
    },
  },
  password: {
    type: String, validate: {
      validator: (value) => validator.isStrongPassword(value, {
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }),
      message: 'Password is not strong enough.',
    },
    required: function() {
      return !this.googleId;
    },
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  },
  cryptos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crypto',
  }],
  vs_currency: {
    type: String,
    required: true,
    enum: ['usd', 'eur'],
    default: 'eur',
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
export default mongoose.model('User', userSchema);
