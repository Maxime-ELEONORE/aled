import RssFeedsService from '../Services/RssFeedsService.js';
import Keyword from "../Models/KeywordModel.js";

const RssFeedsController = {
  
  async getRssFeedsByKeywords(req, res) {
    try {
      const keywordDocs = await Keyword.find({ userIds: { $in: [req.user.userId] } });
      const keywords = keywordDocs.map(doc => doc.keyword);
      let response = await RssFeedsService.getRssFeedsByKeywords(keywords, 20);
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffleArray(response);
      res.status(200).send(response);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },
  

  async getArticleById(req, res) {
    try {
      const { id } = req.params;
      const article = await RssFeedsService.getArticleById(id);
      if (article) {
        res.status(200).json(article);
      } else {
        res.status(404).json({ message: 'Article not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
};

export default RssFeedsController;