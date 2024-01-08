import express from 'express';
import RssFeedsController from '../Controllers/RssFeedsController.js';
import AuthenticationMiddlewares from '../Middlewares/AuthenticationMiddlewares.js';


const router = express.Router();

router.get('/', AuthenticationMiddlewares.verifyToken, RssFeedsController.getRssFeedsByKeywords);
router.get('/:id', RssFeedsController.getArticleById);


export default router;