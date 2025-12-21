const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(
    'https://marketplace.ticketek.com.au/purchase/searchlist?keyword=Cameron%20winter',
    { waitUntil: 'networkidle' }
  );

  await page.waitForTimeout(5000);

  const pageText = await page.textContent('body');

  if (!pageText.includes('No tickets')) {
    console.log('🎟️ TICKETS MAY BE AVAILABLE!');
    process.exit(1);
  }

  console.log('No tickets yet.');
  await browser.close();
})();
