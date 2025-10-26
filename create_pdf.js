const fs = require('fs');
const path = require('path');
const htmlPdf = require('html-pdf-node');

async function createPDF() {
    try {
        // Read the HTML CV file
        const htmlPath = path.join(__dirname, 'Ahmed_Khaled_CV.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        console.log('Reading HTML file...');
        
        // PDF options
        const options = {
            format: 'A4',
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            },
            printBackground: true,
            displayHeaderFooter: false
        };
        
        // Create PDF buffer
        console.log('Converting HTML to PDF...');
        const file = { content: htmlContent };
        const pdfBuffer = await htmlPdf.generatePdf(file, options);
        
        // Save PDF file
        const pdfPath = path.join(__dirname, 'Ahmed_Khaled_CV.pdf');
        fs.writeFileSync(pdfPath, pdfBuffer);
        
        console.log(`✅ PDF created successfully: ${pdfPath}`);
        console.log(`📄 File size: ${Math.round(pdfBuffer.length / 1024)} KB`);
        
    } catch (error) {
        console.error('❌ Error creating PDF:', error.message);
        
        // Try alternative approach with puppeteer directly
        console.log('Trying alternative PDF generation...');
        await createPDFWithPuppeteer();
    }
}

async function createPDFWithPuppeteer() {
    const puppeteer = require('puppeteer');
    
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Read HTML content
        const htmlPath = path.join(__dirname, 'Ahmed_Khaled_CV.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Set content and generate PDF
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfPath = path.join(__dirname, 'Ahmed_Khaled_CV.pdf');
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            },
            printBackground: true
        });
        
        await browser.close();
        
        console.log(`✅ PDF created successfully with Puppeteer: ${pdfPath}`);
        
        // Check file size
        const stats = fs.statSync(pdfPath);
        console.log(`📄 File size: ${Math.round(stats.size / 1024)} KB`);
        
    } catch (error) {
        console.error('❌ Error with Puppeteer:', error.message);
        console.log('💡 HTML and TXT versions are available as alternatives');
    }
}

// Run the PDF creation
createPDF();
