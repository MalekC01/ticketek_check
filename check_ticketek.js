const { chromium } = require('playwright');
const fetch = require('node-fetch'); // Required for sending Discord notifications

// Replace this with your Discord webhook URL
const webhookUrl = 'https://discord.com/api/webhooks/1452333765543071758/p3ZYRXIGmtFFrtQ9Vk0BJ3uplf3NilBSxw7urcA3xhyJ1pqjRnk6GbqRHqqM3Os8dU6G';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Go to the Ticketek search page
  await page.goto(
    'https://marketplace.ticketek.com.au/purchase/searchlist?keyword=Cameron%20winter',
    { waitUntil: 'networkidle' }
  );

  // Wait a few seconds for JavaScript content to load
  await page.waitForTimeout(5000);

  // Get the full text content of the page
  const pageText = await page.textContent('body');

  // Check if tickets are available
  if (!pageText.includes('None Available')) {
    console.log('🎟️ TICKETS MAY BE AVAILABLE!');

    // Send Discord notification
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: '🎟️ Cameron Winter tickets may be available! Check here: https://marketplace.ticketek.com.au/purchase/searchlist?keyword=Cameron%20winter'
        })
      });
      console.log('Discord notification sent.');
    } catch (err) {
      console.error('Failed to send Discord notification:', err);
    }

    // Exit with failure to optionally trigger GitHub Actions email
    process.exit(1);
  }

  console.log('No tickets yet.');
  await browser.close();
})();
