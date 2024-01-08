import express from 'express';
import CryptoDataController from '../Controllers/CryptoDatasController.js';

const router = express.Router();

router.get('/:cryptoIds', CryptoDataController.getDatas);
router.get('/usd/to/eur', CryptoDataController.getUSDtoEUR);
router.get('/fiddlesticks/:cryptoId/:period', CryptoDataController.getCandlesticksData);
export default router;
