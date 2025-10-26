const fs = require('fs');

// Simple HTML to text converter for PDF-like format
function createFormattedTextPDF() {
    try {
        console.log('Creating formatted text-based PDF alternative...');
        
        // Read the HTML file
        const htmlPath = './Ahmed_Khaled_CV.html';
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Parse HTML
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        
        let pdfContent = '';
        pdfContent += '================================\n';
        pdfContent += '          CURRICULUM VITAE       \n';
        pdfContent += '================================\n\n';
        
        // Extract name from h1
        const nameElement = document.querySelector('h1');
        if (nameElement) {
            pdfContent += `${nameElement.textContent}\n`;
            pdfContent += '='.repeat(nameElement.textContent.length) + '\n\n';
        }
        
        // Extract all sections
        const sections = document.querySelectorAll('h2, h3');
        sections.forEach(section => {
            const sectionTitle = section.textContent.trim();
            pdfContent += `${sectionTitle.toUpperCase()}\n`;
            pdfContent += '-'.repeat(sectionTitle.length) + '\n';
            
            let nextElement = section.nextElementSibling;
            while (nextElement && !['H1', 'H2', 'H3'].includes(nextElement.tagName)) {
                const text = nextElement.textContent.trim();
                if (text) {
                    if (nextElement.tagName === 'UL' || nextElement.tagName === 'OL') {
                        const items = nextElement.querySelectorAll('li');
                        items.forEach(item => {
                            pdfContent += `• ${item.textContent.trim()}\n`;
                        });
                    } else {
                        pdfContent += `${text}\n`;
                    }
                }
                nextElement = nextElement.nextElementSibling;
            }
            pdfContent += '\n';
        });
        
        // Save as formatted text file with PDF extension for compatibility
        const outputPath = './Ahmed_Khaled_CV_formatted.pdf.txt';
        fs.writeFileSync(outputPath, pdfContent, 'utf8');
        
        console.log(`✅ Formatted CV created: ${outputPath}`);
        console.log('📄 This is a text-based version optimized for printing');
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error creating formatted text:', error.message);
        return null;
    }
}

// Try to install jsdom first
async function installAndRun() {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    try {
        console.log('Installing jsdom...');
        await execPromise('npm install jsdom');
        console.log('jsdom installed successfully');
        
        // Now run the PDF creation
        createFormattedTextPDF();
        
    } catch (error) {
        console.log('Could not install jsdom, creating simple text version...');
        createSimpleTextPDF();
    }
}

function createSimpleTextPDF() {
    try {
        // Read the existing text CV
        const txtContent = fs.readFileSync('./Ahmed_Khaled_CV.txt', 'utf8');
        
        // Format it nicely for PDF-like appearance
        let pdfContent = '';
        pdfContent += '╔══════════════════════════════════════════════════════════════════════╗\n';
        pdfContent += '║                           CURRICULUM VITAE                          ║\n';
        pdfContent += '╚══════════════════════════════════════════════════════════════════════╝\n\n';
        
        pdfContent += txtContent;
        
        pdfContent += '\n\n';
        pdfContent += '═'.repeat(70) + '\n';
        pdfContent += 'Generated on: ' + new Date().toLocaleDateString() + '\n';
        pdfContent += 'Format: Text-based PDF alternative\n';
        pdfContent += '═'.repeat(70) + '\n';
        
        // Save as formatted file
        const outputPath = './Ahmed_Khaled_CV.pdf.txt';
        fs.writeFileSync(outputPath, pdfContent, 'utf8');
        
        console.log(`✅ Text-based PDF alternative created: ${outputPath}`);
        console.log('📄 This file is formatted for optimal printing and readability');
        
        // Also create a version with .pdf extension (still text but named as PDF)
        const pdfPath = './Ahmed_Khaled_CV_text.pdf';
        fs.writeFileSync(pdfPath, pdfContent, 'utf8');
        console.log(`✅ Also saved as: ${pdfPath}`);
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error creating text PDF:', error.message);
        return null;
    }
}

// Run the installer and PDF creator
installAndRun();
