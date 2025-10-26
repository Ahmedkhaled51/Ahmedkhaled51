const fs = require('fs');

// Simple text-based PDF creator
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

// Run the PDF creator
createSimpleTextPDF();
