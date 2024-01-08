import express from 'express';
import UserController from '../Controllers/UsersController.js';
import AuthenticationMiddleware from '../Middlewares/AuthenticationMiddlewares.js';
import UserMiddlewares from '../Middlewares/UserMiddlewares.js';

const router = express.Router();

router.use(AuthenticationMiddleware.verifyToken);

router.get('/', UserMiddlewares.isAdmin, UserController.getAll);
router.get('/autorized-crypto', UserController.getAllUserCrypto);
router.get('/:id', UserMiddlewares.isAuthorized, UserController.getById);
router.post('/', UserMiddlewares.isAdmin, UserController.create);
router.put('/:id', UserMiddlewares.isAuthorized, UserController.update);
router.delete('/:id', UserMiddlewares.isAdmin, UserController.delete);
router.get('/info/role', UserController.getUserRole);
router.post('/add-crypto/:cryptoId', UserController.add_crypto_to_user);
router.delete('/remove-crypto/:cryptoId', UserMiddlewares.isAuthorized, UserController.remove_crypto_from_user);
export default router;
