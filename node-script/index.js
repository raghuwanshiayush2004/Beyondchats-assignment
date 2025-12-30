require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const { OpenAI } = require('openai');

class ArticleEnhancer {
    constructor() {
        this.baseURL = 'http://localhost:8000/api';
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async fetchArticles() {
        try {
            const response = await axios.get(`${this.baseURL}/articles`);
            return response.data;
        } catch (error) {
            console.error('Error fetching articles:', error.message);
            return [];
        }
    }

    async searchGoogle(title) {
        try {
           
            const searchQuery = encodeURIComponent(title);
            
            // Using a mock/search service 
            return [
                'https://example.com/blog/article1',
                'https://example.com/blog/article2'
            ];
        } catch (error) {
            console.error('Google search error:', error);
            return [];
        }
    }

    async scrapeArticleContent(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            const $ = cheerio.load(response.data);
            
            // Extract main content 
            let content = '';
            $('article, .post-content, .entry-content, main').each((i, elem) => {
                content += $(elem).text() + '\n';
            });
            
            return content.substring(0, 5000); // Limit content length
        } catch (error) {
            console.error(`Error scraping ${url}:`, error.message);
            return '';
        }
    }

    async enhanceWithAI(originalContent, referenceContents) {
        try {
            const prompt = `
            Original Article: ${originalContent}
            
            Reference Articles: ${referenceContents.join('\n\n')}
            
            Please rewrite and enhance the original article to match the style, formatting, 
            and quality of the reference articles. Keep the core message but improve:
            1. Structure and flow
            2. Engagement level
            3. Professional tone
            4. SEO optimization
            
            Return only the enhanced article content.
            `;

            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional content editor and SEO specialist."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('AI enhancement error:', error);
            return originalContent;
        }
    }

    async processArticle(article) {
        console.log(`Processing: ${article.title}`);
        
        // Search Google for similar articles
        const searchUrls = await this.searchGoogle(article.title);
        
        // Scrape top 2 results
        const referenceContents = [];
        const referenceUrls = [];
        
        for (let i = 0; i < Math.min(2, searchUrls.length); i++) {
            const content = await this.scrapeArticleContent(searchUrls[i]);
            if (content) {
                referenceContents.push(content);
                referenceUrls.push(searchUrls[i]);
            }
        }
        
        if (referenceContents.length === 0) {
            console.log('No reference articles found');
            return;
        }
        
        // Enhance with AI
        const enhancedContent = await this.enhanceWithAI(article.content, referenceContents);
        
        // Add citations
        const citations = referenceUrls.map(url => `Source: ${url}`).join('\n');
        const finalContent = `${enhancedContent}\n\n---\n**References:**\n${citations}`;
        
        // Create updated article
        const updatedArticle = {
            title: `[UPDATED] ${article.title}`,
            content: finalContent,
            original_article_id: article.id,
            is_updated: true,
            references: referenceUrls
        };
        
        // Save via API
        await axios.post(`${this.baseURL}/articles`, updatedArticle);
        
        console.log(`Article enhanced and saved: ${updatedArticle.title}`);
    }

    async run() {
        console.log('Starting article enhancement process...');
        
        const articles = await this.fetchArticles();
        
        for (const article of articles) {
            if (!article.is_updated) {
                await this.processArticle(article);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Delay between requests
            }
        }
        
        console.log('Process completed!');
    }
}

// Run the script
const enhancer = new ArticleEnhancer();
enhancer.run();