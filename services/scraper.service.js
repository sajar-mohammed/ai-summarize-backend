const axios = require('axios');
const cheerio = require('cheerio');

const scrapeUrl = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-GB,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'max-age=0',
                'Referer': 'https://t.co/' // Twitter/X referrer often bypasses blocks
            },
            timeout: 15000,
            maxRedirects: 5
        });

        const $ = cheerio.load(data);

        // Remove script and style elements
        $('script, style, nav, footer, header, noscript, iframe, ad, .ad, .ads, .sidebar').remove();

        // Get main content text
        let content = '';
        const selectors = [
            'article', 
            'main', 
            'section.meteredContent', // Medium specific
            '.post-content', 
            '.article-content', 
            '.caas-body', // Yahoo/Others
            '#main-content',
            '.main-content'
        ];
        
        for (const selector of selectors) {
            const element = $(selector);
            if (element.length) {
                const text = element.text().trim();
                if (text.length > 500) {
                    content = text;
                    break;
                }
            }
        }

        // Fallback to p tags if no main container found
        if (!content) {
            content = $('p').map((i, el) => $(el).text()).get().join(' ').trim();
        }

        // Final fallback to body text
        if (!content || content.length < 100) {
            content = $('body').text().trim();
        }

        if (!content || content.length < 50) {
            throw new Error('No readable content found on this page');
        }

        // Basic cleanup: replace multiple spaces/newlines
        return content.replace(/\s+/g, ' ').substring(0, 8000); 
    } catch (error) {
        const status = error.response?.status;
        const msg = status === 403 ? 'Access Forbidden (Site blocked extraction)' : error.message;
        console.error(`Scraping Error [${url}]:`, msg);
        throw new Error(`Scraper Error: ${msg}`);
    }
};

module.exports = { scrapeUrl };
