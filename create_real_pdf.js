const fs = require('fs');
const { JSDOM } = require('jsdom');
const { jsPDF } = require('jspdf');

function createPDFFromHTML() {
    try {
        console.log('Creating PDF from HTML...');
        
        // Read HTML content
        const htmlContent = fs.readFileSync('./Ahmed_Khaled_CV.html', 'utf8');
        
        // Parse HTML with JSDOM
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        
        // Create new jsPDF instance
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        let yPosition = 20;
        const leftMargin = 20;
        const pageHeight = pdf.internal.pageSize.height;
        const lineHeight = 6;
        
        // Extract and add content
        
        // Name/Title
        const nameElement = document.querySelector('h1');
        if (nameElement) {
            pdf.setFontSize(20);
            pdf.setFont(undefined, 'bold');
            pdf.text(nameElement.textContent.trim(), leftMargin, yPosition);
            yPosition += 10;
        }
        
        // Contact info
        const contactSection = document.querySelector('.contact-info, .personal-info');
        if (contactSection) {
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'normal');
            const contactText = contactSection.textContent.trim().replace(/\s+/g, ' ');
            pdf.text(contactText, leftMargin, yPosition);
            yPosition += 8;
        }
        
        // Add a line separator
        pdf.line(leftMargin, yPosition, 190, yPosition);
        yPosition += 10;
        
        // Process sections
        const sections = document.querySelectorAll('h2, h3');
        sections.forEach(section => {
            // Check if we need a new page
            if (yPosition > pageHeight - 30) {
                pdf.addPage();
                yPosition = 20;
            }
            
            // Section title
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            const sectionTitle = section.textContent.trim();
            pdf.text(sectionTitle, leftMargin, yPosition);
            yPosition += 8;
            
            // Section content
            pdf.setFontSize(11);
            pdf.setFont(undefined, 'normal');
            
            let nextElement = section.nextElementSibling;
            while (nextElement && !['H1', 'H2', 'H3'].includes(nextElement.tagName)) {
                const text = nextElement.textContent.trim();
                if (text) {
                    if (nextElement.tagName === 'UL' || nextElement.tagName === 'OL') {
                        const items = nextElement.querySelectorAll('li');
                        items.forEach(item => {
                            const itemText = `• ${item.textContent.trim()}`;
                            const lines = pdf.splitTextToSize(itemText, 160);
                            lines.forEach(line => {
                                if (yPosition > pageHeight - 20) {
                                    pdf.addPage();
                                    yPosition = 20;
                                }
                                pdf.text(line, leftMargin + 5, yPosition);
                                yPosition += lineHeight;
                            });
                        });
                    } else {
                        const lines = pdf.splitTextToSize(text, 160);
                        lines.forEach(line => {
                            if (yPosition > pageHeight - 20) {
                                pdf.addPage();
                                yPosition = 20;
                            }
                            pdf.text(line, leftMargin, yPosition);
                            yPosition += lineHeight;
                        });
                    }
                }
                nextElement = nextElement.nextElementSibling;
            }
            yPosition += 5; // Extra space between sections
        });
        
        // Save PDF
        const pdfPath = './Ahmed_Khaled_CV.pdf';
        const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
        fs.writeFileSync(pdfPath, pdfBuffer);
        
        console.log(`✅ PDF created successfully: ${pdfPath}`);
        console.log(`📄 File size: ${Math.round(pdfBuffer.length / 1024)} KB`);
        
        return pdfPath;
        
    } catch (error) {
        console.error('❌ Error creating PDF:', error.message);
        console.log('📝 Falling back to text-based alternative...');
        
        // Fallback to simple text version
        createSimpleTextPDF();
        return null;
    }
}

function createSimpleTextPDF() {
    try {
        const txtContent = fs.readFileSync('./Ahmed_Khaled_CV.txt', 'utf8');
        
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
        
        const outputPath = './Ahmed_Khaled_CV_fallback.pdf';
        fs.writeFileSync(outputPath, pdfContent, 'utf8');
        
        console.log(`✅ Text-based PDF alternative created: ${outputPath}`);
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error creating fallback PDF:', error.message);
        return null;
    }
}

// Run PDF creation
createPDFFromHTML();
