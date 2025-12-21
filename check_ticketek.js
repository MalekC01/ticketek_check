const { chromium } = require('playwright');
const axios = require('axios');

// Your working Discord webhook
const webhookUrl = 'https://discord.com/api/webhooks/1452337739704959158/tL7M9soUgzt2o3IDarVNZwR_39zTwYFW8RAv5xpDIiRDRHa7s4zkU_Fw_HczFK0iPlhg';

(async () => {
  console.log('Starting Ticketek check...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(
      'https://marketplace.ticketek.com.au/purchase/searchlist?keyword=Cameron%20winter',
      { waitUntil: 'networkidle' }
    );

    await page.waitForTimeout(7000);
    const pageText = await page.content();
    console.log('Page content length:', pageText.length);

    if (!pageText.includes('None Available')) {
      console.log('🎟️ TICKETS MAY BE AVAILABLE!');

      try {
        const response = await axios.post(webhookUrl, {
          content: '🎟️ Cameron Winter tickets may be available! Check here: https://marketplace.ticketek.com.au/purchase/searchlist?keyword=Cameron%20winter'
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('Discord response status:', response.status);
      } catch (err) {
        console.error('Failed to send Discord notification:', err.message);
      }
    } else {
      console.log('No tickets available yet.');
    }
  } catch (err) {
    console.error('Error loading page or checking tickets:', err.message);
  }

  await browser.close();
})();
