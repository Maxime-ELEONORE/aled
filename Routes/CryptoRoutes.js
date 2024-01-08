import express from 'express';
import CryptosController from '../Controllers/CryptosController.js';
import UserMiddlewares from '../Middlewares/UserMiddlewares.js';
import AuthenticationMiddleware from '../Middlewares/AuthenticationMiddlewares.js';


const router = express.Router();

router.get('/', CryptosController.getAll);
router.get('/:id', CryptosController.getById);
router.post('/', AuthenticationMiddleware.verifyToken,
    UserMiddlewares.isAdmin, CryptosController.create);
router.put('/:id', AuthenticationMiddleware.verifyToken,
    UserMiddlewares.isAdmin, CryptosController.update);
router.delete('/:id', AuthenticationMiddleware.verifyToken,
    UserMiddlewares.isAdmin, CryptosController.delete);
router.get('/coin-gueko/top100', AuthenticationMiddleware.verifyToken,
    UserMiddlewares.isAdmin, CryptosController.getTop100);

export default router;
