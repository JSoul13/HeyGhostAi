const puppeteer = require('puppeteer');
const fs = require('fs');

const websites = [
    { url: 'https://jsoul13.github.io/MyEntityai/', name: 'MyEntityAI' },
    { url: 'https://jsoul13.github.io/GhostLink/', name: 'GhostLink' },
    { url: 'https://jsoul13.github.io/MyEntity2/', name: 'MyEntity2' },
    { url: 'https://ghosttube.com/products/ghosttube-original', name: 'GhostTube' }
];

async function analyzeWebsite(page, website, index) {
    try {
        console.log(`Analyzing ${website.name}...`);
        
        // Navigate to the website
        await page.goto(website.url, { 
            waitUntil: 'networkidle2', 
            timeout: 20000 
        });
        
        // Wait for content to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Take full page screenshot
        await page.screenshot({ 
            path: `site${index + 1}_${website.name.toLowerCase()}.png`, 
            fullPage: true 
        });
        
        // Extract design information
        const designInfo = await page.evaluate(() => {
            const body = document.body;
            const bodyStyles = window.getComputedStyle(body);
            
            // Get unique font families
            const allElements = document.querySelectorAll('*');
            const fontFamilies = new Set();
            
            for (let i = 0; i < Math.min(allElements.length, 50); i++) {
                const style = window.getComputedStyle(allElements[i]);
                if (style.fontFamily && style.fontFamily !== 'inherit') {
                    fontFamilies.add(style.fontFamily);
                }
            }
            
            // Get color information
            const colors = {
                background: bodyStyles.backgroundColor,
                color: bodyStyles.color,
                headerColors: [],
                buttonColors: []
            };
            
            // Sample header colors
            const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            for (let i = 0; i < Math.min(headers.length, 5); i++) {
                const style = window.getComputedStyle(headers[i]);
                colors.headerColors.push({
                    color: style.color,
                    background: style.backgroundColor
                });
            }
            
            // Sample button colors
            const buttons = document.querySelectorAll('button, .btn, [role="button"]');
            for (let i = 0; i < Math.min(buttons.length, 5); i++) {
                const style = window.getComputedStyle(buttons[i]);
                colors.buttonColors.push({
                    color: style.color,
                    background: style.backgroundColor
                });
            }
            
            return {
                title: document.title,
                metaDescription: document.querySelector('meta[name="description"]')?.content || '',
                fontFamilies: Array.from(fontFamilies).slice(0, 10),
                colors: colors,
                hasNavigation: !!document.querySelector('nav, .nav, .navbar'),
                hasHero: !!document.querySelector('.hero, .banner, .jumbotron'),
                hasCards: !!document.querySelector('.card, .feature, .service'),
                hasFooter: !!document.querySelector('footer')
            };
        });
        
        console.log(`✓ Successfully analyzed ${website.name}`);
        return {
            website: website.name,
            url: website.url,
            screenshot: `site${index + 1}_${website.name.toLowerCase()}.png`,
            ...designInfo
        };
        
    } catch (error) {
        console.error(`✗ Error analyzing ${website.name}:`, error.message);
        return {
            website: website.name,
            url: website.url,
            error: error.message
        };
    }
}

async function main() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    const results = [];
    
    for (let i = 0; i < websites.length; i++) {
        const result = await analyzeWebsite(page, websites[i], i);
        results.push(result);
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Save analysis results
    fs.writeFileSync('design_analysis.json', JSON.stringify(results, null, 2));
    
    await browser.close();
    console.log('\n🎉 Analysis complete! Screenshots and design data saved.');
    console.log('Files created:');
    results.forEach((result, index) => {
        if (result.screenshot) {
            console.log(`- ${result.screenshot}`);
        }
    });
}

main().catch(console.error);
