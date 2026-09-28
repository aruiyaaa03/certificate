import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export async function exportCertificateAsPdf(
  elementId: string, 
  studentName: string = 'Certificate',
  onProgress?: (status: string) => void
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate element not found');
  }

  onProgress?.('Preparing high-resolution render...');

  // Wait a short moment to ensure fonts are fully loaded
  await document.fonts.ready;

  // Render element to high-res canvas (scale 2.5 for crisp 300 DPI print quality)
  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    onclone: (clonedDoc) => {
      const clonedEl = clonedDoc.getElementById(elementId);
      if (clonedEl) {
        // Ensure exact landscape proportions and no transform scale issues
        clonedEl.style.transform = 'none';
        clonedEl.style.margin = '0';
        clonedEl.style.boxShadow = 'none';
      }
    }
  });

  onProgress?.('Generating PDF document...');

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // A4 Landscape: 297mm x 210mm
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

  const sanitizedName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'SSC_Certificate';
  pdf.save(`SSC_Certificate_${sanitizedName}.pdf`);
  onProgress?.('Done!');
}

export async function exportCertificateAsPng(
  elementId: string,
  studentName: string = 'Certificate',
  onProgress?: (status: string) => void
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Certificate element not found');
  }

  onProgress?.('Generating image...');
  await document.fonts.ready;

  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc) => {
      const clonedEl = clonedDoc.getElementById(elementId);
      if (clonedEl) {
        clonedEl.style.transform = 'none';
        clonedEl.style.margin = '0';
        clonedEl.style.boxShadow = 'none';
      }
    }
  });

  const link = document.createElement('a');
  const sanitizedName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'SSC_Certificate';
  link.download = `SSC_Certificate_${sanitizedName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  onProgress?.('Done!');
}

export function printCertificate(): void {
  window.print();
}
