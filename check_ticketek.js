const { chromium } = require('playwright');
const axios = require('axios');

// Replace with your Discord webhook
const webhookUrl = 'https://discord.com/api/webhooks/1452337739704959158/tL7M9soUgzt2o3IDarVNZwR_39zTwYFW8RAv5xpDIiRDRHa7s4zkU_Fw_HczFK0iPlhg';

(async () => {
  console.log('=== Starting Ticketek check ===');

  // Launch headful Chromium
  const browser = await chromium.launch({
    headless: false, // visible browser
    args: [
      '--disable-web-security',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  // Create context with user agent
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // Go to Ticketek page
    console.log('Navigating to Ticketek page...');
    await page.goto(
      'https://marketplace.ticketek.com.au/purchase/searchlist?keyword=Cameron%20winter',
      { timeout: 60000, waitUntil: 'domcontentloaded' }
    );

    // Wait for JS-rendered content
    console.log('Waiting for page content to render...');
    await page.waitForTimeout(10000);

    const pageText = await page.content();
    console.log('Page content length:', pageText.length);

    // Save page for debugging if needed
    require('fs').writeFileSync('page.html', pageText);
    console.log('Saved page.html for inspection.');

    // Only send Discord notification if tickets are available
    if (!pageText.includes('None Available')) {
      const message = '🎟️ Cameron Winter tickets may be available! Check here: https://marketplace.ticketek.com.au/purchase/searchlist?keyword=Cameron%20winter';
      console.log('🎟️ TICKETS MAY BE AVAILABLE! Sending Discord notification...');

      try {
        const response = await axios.post(webhookUrl, { content: message }, {
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('Discord response status:', response.status);
      } catch (err) {
        console.error('Failed to send Discord message:', err.message);
      }
    } else {
      console.log('No tickets available. No Discord message sent.');
    }

  } catch (err) {
    console.error('Error loading page or checking tickets:', err.message);
  }

  // Keep browser open for debugging
  console.log('Script finished. You can close the browser manually.');
})();
