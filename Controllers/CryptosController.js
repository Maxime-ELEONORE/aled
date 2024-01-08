import Crypto from '../Models/CryptoModel.js';
import CoinGeckoService from '../Services/CoinGueckoService.js';

const CryptosController = {
  getAll: async (req, res) => {
    try {
      const cryptos = await Crypto.find();
      res.json(cryptos);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  },

  getById: async (req, res) => {
    try {
      const crypto = await Crypto.findById(req.params.id);
      if (!crypto) {
        return res.status(404).json({message: 'Crypto not found'});
      }
      res.json(crypto);
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  },

  create: async (req, res) => {
    const crypto = new Crypto(req.body);
    try {
      const newCrypto = await crypto.save();
      res.status(201).json(newCrypto);
    } catch (err) {
      res.status(400).json({message: err.message});
    }
  },

  update: async (req, res) => {
    try {
      const crypto = await Crypto.findByIdAndUpdate(req.params.id, req.body, {new: true});
      if (!crypto) {
        return res.status(404).json({message: 'Crypto not found'});
      }
      res.json(crypto);
    } catch (err) {
      res.status(400).json({message: err.message});
    }
  },

  delete: async (req, res) => {
    try {
      const crypto = await Crypto.findByIdAndDelete(req.params.id);
      if (!crypto) {
        return res.status(404).json({message: 'Crypto not found'});
      }
      res.json({message: 'Crypto deleted'});
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  },
  async getTop100(req, res) {
    try {
      const response = await CoinGeckoService.getTop100Cryptos();
      res.status(200).send(response);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },
};
export default CryptosController;
