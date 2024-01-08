import axios from 'axios';
import Crypto from '../Models/CryptoModel.js';
import axiosRateLimit from "axios-rate-limit";

const http = axiosRateLimit(axios.create(), { maxRequests: 1, perMilliseconds: 10000, maxRPS: 1 })
const baseURL = 'https://api.coingecko.com/api/v3';
const apiKeys = [ process.env.COIN_GUEKO_API_KEY,  process.env.COIN_GUEKO_API_KEY2,  process.env.COIN_GUEKO_API_KEY3 ];
let apiKeyIndex = 0;
const CoinGeckoService = {

  getTop100Cryptos: async () => {
    try {
      const response = await http.get(`${baseURL}/coins/markets`, {
        headers: {
          'x-cg-demo-api-key': apiKeys[apiKeyIndex%3],
        },
        params: {
          vs_currency: 'eur',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      });
      apiKeyIndex += 1;
      return response.data;
    } catch (error) {
      console.error('Error fetching top 100 cryptos:', error);
      throw error;
    }
  },

  fetchUSDtoEUR: async () => {
    try {
      http.setMaxRPS(2)
      http.setRateLimitOptions({ maxRequests: 2, perMilliseconds: 60000 })
      const response = await http.get(`${baseURL}/simple/price`, {
        headers: {
          'x-cg-demo-api-key': apiKeys[apiKeyIndex%3],
        },
        params: {
          ids: 'usd',
          vs_currencies: 'eur'
        },
      });
      apiKeyIndex += 1;
      return response.data;
    } catch (error) {
      console.error("Error fetching ust to eur:", error);
      return null;
    }
  },

  fetchMarketData: async (cryptoID) => {
    try {
      http.setMaxRPS(1)
      http.setRateLimitOptions({ maxRequests: 1, perMilliseconds: 10000 })
      const crypto = await Crypto.findById(cryptoID);
      const coinId = crypto.coinID;
      const response = await http.get(`${baseURL}/coins/${coinId}`, {
        headers: {
          'x-cg-demo-api-key': apiKeys[apiKeyIndex%3],
        }});
      apiKeyIndex += 1;
      return response.data;
    } catch (error) {
      console.error("Error fetching market data from CoinGecko:", error);
      return null;
    }
  },

  fetchCandlestickData: async (cryptoID, days = 'max') => {
    try {
      http.setMaxRPS(1)
      http.setRateLimitOptions({ maxRequests: 1, perMilliseconds: 10000 })
      const crypto = await Crypto.findById(cryptoID);
      const coinId = crypto.coinID;
      const response = await http.get(`${baseURL}/coins/${coinId}/ohlc`, {
        headers: {
          'x-cg-demo-api-key': apiKeys[apiKeyIndex%3],
        },
        params: { vs_currency: 'eur', days }
      });
      apiKeyIndex += 1;
      return response.data;
    } catch (error) {
      console.error("Error fetching candlestick data from CoinGecko:", error);
      return null;
    }
  },

};

export default CoinGeckoService;
