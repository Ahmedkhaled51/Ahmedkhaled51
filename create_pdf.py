import subprocess
import sys
from pathlib import Path

def html_to_pdf_simple(html_file, output_file):
    """Create a simple PDF using basic HTML to text conversion."""
    try:
        # Try using a browser if available (headless Chrome/Chromium)
        result = subprocess.run([
            'google-chrome', '--headless', '--disable-gpu', 
            '--print-to-pdf=' + output_file, 
            html_file
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            return True
    except FileNotFoundError:
        pass
    
    try:
        # Try using chromium
        result = subprocess.run([
            'chromium-browser', '--headless', '--disable-gpu', 
            '--print-to-pdf=' + output_file, 
            html_file
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            return True
    except FileNotFoundError:
        pass
    
    return False

if __name__ == "__main__":
    html_file = "/vercel/sandbox/Ahmed_Khaled_CV.html"
    pdf_file = "/vercel/sandbox/Ahmed_Khaled_CV.pdf"
    
    if html_to_pdf_simple(html_file, pdf_file):
        print(f"PDF created successfully: {pdf_file}")
    else:
        print("Could not create PDF - no suitable converter found")
        print("HTML and TXT versions are available instead")
        
    # Print available files
    print("\nGenerated CV files:")
    for file in ["/vercel/sandbox/Ahmed_Khaled_CV.html", "/vercel/sandbox/Ahmed_Khaled_CV.txt"]:
        if Path(file).exists():
            print(f"✓ {file}")
