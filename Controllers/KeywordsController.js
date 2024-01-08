import Keyword from '../Models/KeywordModel.js';

const KeywordsController = {
    createKeyword: async (req, res) => {
        try {
            const newKeyword = new Keyword(req.body);
            const savedKeyword = await newKeyword.save();
            res.status(201).json(savedKeyword);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAllKeywords: async (req, res) => {
        try {
            const keywords = await Keyword.find();
            res.status(200).json(keywords);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    deleteKeyword: async (req, res) => {
        try {
            await Keyword.findByIdAndDelete(req.params.id);
            res.status(200).json("Keyword has been deleted...");
        } catch (error) {
            res.status(500).json(error);
        }
    },

    get_keywords_by_userId: async (req, res) => {
        try {
            const keywords = await Keyword.find({ userIds: { $in: [req.params.userId] } });
            res.status(200).json(keywords);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    add_user_to_keyword: async (req, res) => {
        try {
            const keyword = await Keyword.findById(req.params.id);
            if (!keyword.userIds.includes(req.body.userId)) {
                keyword.userIds.push(req.body.userId);
                await keyword.save();
                res.status(200).json("User added to keyword.");
            } else {
                res.status(400).json("User already exists in keyword.");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    remove_user_from_keyword: async (req, res) => {
        try {
            const keyword = await Keyword.findById(req.params.id);
            keyword.userIds = keyword.userIds.filter(userId => userId.toString() !== req.body.userId);
            await keyword.save();
            res.status(200).json("User removed from keyword.");
        } catch (error) {
            res.status(500).json(error);
        }
    }
}
export default KeywordsController;
