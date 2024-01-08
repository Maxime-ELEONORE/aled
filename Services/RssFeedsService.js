import axios from 'axios';

const baseURL = 'https://newsapi.org/v2';

const processArticles = (articles) => {
    return articles.map(article => {
        if (article.source.id === null) {
            article.source.id = `${article.source.name}-${new Date(article.publishedAt).toISOString().split('T')[0]}`;
        }
        return article;
    });
};

const RssFeedsService = {
    getRssFeedsByKeywords: async (keywords = ['bitcoin'], articlesPerKeywords = 3) => {
        try {
            let combinedArticles = [];

            for (const keyword of keywords) {
                const response = await axios.get(`${baseURL}/everything`, {
                    headers: {
                        'x-api-key': process.env.NEWS_API_KEY,
                    },
                    params: {
                        q: keyword,
                        language: 'en',
                        pageSize: articlesPerKeywords,
                        page: 1,
                    },
                });

                combinedArticles = combinedArticles.concat(processArticles(response.data.articles));
            }

            return (combinedArticles);
        } catch (error) {
            console.error('Error fetching RSS feeds', error);
            throw error;
        }
    },
    getArticleById: async (id) => {
        try {
            // Assuming `id` is the title of the article or a unique keyword
            const response = await axios.get(`${baseURL}/everything`, {
                headers: {
                    'x-api-key': process.env.NEWS_API_KEY,
                },
                params: {
                    q: id, // Use the ID as a keyword for search
                    language: 'en',
                    pageSize: 1, // Assuming the first result is the most relevant
                },
            });

            if (response.data.articles.length > 0) {
                return response.data.articles[0];
            } else {
                return null; // No articles found
            }
        } catch (error) {
          console.error('Error fetching article by ID', error);
          throw error;
        }
      },
};

export default RssFeedsService;