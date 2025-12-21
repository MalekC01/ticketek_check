const { chromium } = require('playwright');

// Your Discord webhook URL
const webhookUrl = 'https://discord.com/api/webhooks/1452333765543071758/p3ZYRXIGmtFFrtQ9Vk0BJ3uplf3NilBSxw7urcA3xhyJ1pqjRnk6GbqRHqqM3Os8dU6G';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(
    'https://marketplace.ticketek.com.au/purchase/searchlist?keyword=Cameron%20winter',
    { waitUntil: 'networkidle' }
  );

  await page.waitForTimeout(5000);

  const pageText = await page.textContent('body');

  // TEST MODE: always trigger notification
  if (true) {
    console.log('🎟️ TICKETS MAY BE AVAILABLE!');

    // Send Discord notification using native fetch
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

    // Wait a second to ensure request completes before exiting
    await new Promise(res => setTimeout(res, 1000));

    process.exit(1); // optional: triggers GitHub email
  }

  console.log('No tickets yet.');
  await browser.close();
})();
