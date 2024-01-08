import express from 'express';
import KeywordsController from '../Controllers/KeywordsController.js';
import AuthenticationMiddlewares from '../Middlewares/AuthenticationMiddlewares.js';
import UserMiddlewares from "../Middlewares/UserMiddlewares.js";

const router = express.Router();

router.post('/', AuthenticationMiddlewares.verifyToken, KeywordsController.createKeyword);
router.get('/', KeywordsController.getAllKeywords);
router.delete('/:id', AuthenticationMiddlewares.verifyToken, UserMiddlewares.isAdmin, KeywordsController.deleteKeyword);
router.get('/by-user/:userId', AuthenticationMiddlewares.verifyToken, KeywordsController.get_keywords_by_userId);
router.post('/add-user/:id', AuthenticationMiddlewares.verifyToken, KeywordsController.add_user_to_keyword);
router.delete('/remove-user/:id', AuthenticationMiddlewares.verifyToken, KeywordsController.remove_user_from_keyword);

export default router;
