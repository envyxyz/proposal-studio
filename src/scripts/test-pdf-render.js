const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testRender() {
  console.log('Launching Puppeteer headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    console.log('Browser page created. Preparing HTML with Google Fonts Anton and DM Sans...');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans&display=swap" rel="stylesheet">
        <style>
          body {
            background-color: #150A0D;
            color: #F5F1E6;
            font-family: 'DM Sans', sans-serif;
            margin: 0;
            padding: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            box-sizing: border-box;
          }
          .card {
            background-color: #F7F3E9;
            color: #101010;
            padding: 48px;
            border-radius: 2px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
          }
          h1 {
            font-family: 'Anton', sans-serif;
            font-size: 48px;
            margin-top: 0;
            text-transform: uppercase;
            letter-spacing: -1px;
            line-height: 1;
          }
          p {
            font-size: 14px;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Verification PDF</h1>
          <p>This is a testing document confirming that Puppeteer can fetch Google Web Fonts (Anton and DM Sans) and compile print styles accurately.</p>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    console.log('Content injected. Rendering to PDF format...');

    const pdfPath = path.join(__dirname, 'verify-test-output.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 }
    });

    console.log(`Success! PDF successfully created at: ${pdfPath}`);
  } catch (error) {
    console.error('Rendering error:', error);
  } finally {
    await browser.close();
    console.log('Browser shut down.');
  }
}

testRender();
