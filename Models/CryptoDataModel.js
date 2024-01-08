// CryptoData.js
import mongoose from 'mongoose';


const CandlestickSchema = new mongoose.Schema({
    open: Number,
    close: Number,
    high: Number,
    low: Number,
    volume: Number,
    timestamp: Date
}, { _id: false });

const CryptoDataSchema = new mongoose.Schema({
    crypto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crypto',
    },
    symbol: String,
    name: String,
    rank: Number,
    price: Number,
    priceChange24h: Number,
    volume24h: Number,
    high24h: Number,
    low24h: Number,
    marketCap: Number,
    circulatingSupply: Number,
    totalSupply: Number,
    maxSupply: Number,
    lastUpdated: Date,
});

const CandlestickDataSchema = new mongoose.Schema({
    crypto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crypto'
    },
    period: {
        type: String,
        enum: ['4days', '4hours', '30mins']
    },
    candlesticks: [CandlestickSchema]
});

CandlestickDataSchema.index({ crypto: 1, period: 1 }, { unique: true });
export const CryptoData = mongoose.model('CryptoData', CryptoDataSchema);
export const CryptoCandleSticks = mongoose.model('CryptoCandleSticks', CandlestickDataSchema);