const { chromium } = require('playwright');

// Replace with your working Discord webhook URL
const webhookUrl = 'https://discord.com/api/webhooks/1452337739704959158/tL7M9soUgzt2o3IDarVNZwR_39zTwYFW8RAv5xpDIiRDRHa7s4zkU_Fw_HczFK0iPlhg';

(async () => {
  console.log('Starting Ticketek check...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(
    'https://marketplace.ticketek.com.au/purchase/searchlist?keyword=Cameron%20winter',
    { waitUntil: 'networkidle' }
  );

  await page.waitForTimeout(5000); // wait for JavaScript content to load

  const pageText = await page.textContent('body');
  console.log('Page text length:', pageText.length);

  // Check if tickets are available
  if (!pageText.includes('None Available')) {
    console.log('🎟️ TICKETS MAY BE AVAILABLE!');

    // Send Discord notification
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: '🎟️ Cameron Winter tickets may be available! Check here: https://marketplace.ticketek.com.au/purchase/searchlist?keyword=Cameron%20winter'
        })
      });
      console.log('Discord response status:', response.status);
    } catch (err) {
      console.error('Failed to send Discord notification:', err);
    }

    // Wait a short moment to ensure request completes
    await new Promise(res => setTimeout(res, 1000));
  } else {
    console.log('No tickets yet.');
  }

  await browser.close();
})();
