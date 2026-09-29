import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

function prepareClonedCertificate(clonedEl: HTMLElement) {
  clonedEl.style.transform = 'none';
  clonedEl.style.transformOrigin = 'top left';
  clonedEl.style.width = '1120px';
  clonedEl.style.height = '790px';
  clonedEl.style.minWidth = '1120px';
  clonedEl.style.minHeight = '790px';
  clonedEl.style.maxWidth = 'none';
  clonedEl.style.maxHeight = 'none';
  clonedEl.style.margin = '0';
  clonedEl.style.boxShadow = 'none';
  clonedEl.style.overflow = 'visible';

  // Ensure text containers have visible overflow so text is never clipped
  const allElements = clonedEl.querySelectorAll<HTMLElement>('*');
  allElements.forEach((el) => {
    // Preserve overflow on watermark/custom bg containers, but make sure text containers don't clip
    if (el.tagName !== 'svg' && !el.classList.contains('pointer-events-none')) {
      const style = window.getComputedStyle(el);
      if (style.overflow === 'hidden' || style.overflowX === 'hidden' || style.overflowY === 'hidden') {
        el.style.overflow = 'visible';
      }
    }
  });

  // Convert any remaining inputs/textareas to plain text spans
  const inputs = clonedEl.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
  inputs.forEach((input) => {
    const span = document.createElement('span');
    span.textContent = input.value || input.placeholder || '';
    span.className = input.className;
    span.style.cssText = input.style.cssText;
    span.style.display = 'inline-block';
    span.style.overflow = 'visible';
    span.style.whiteSpace = 'nowrap';
    span.style.border = 'none';
    span.style.outline = 'none';
    span.style.background = 'transparent';
    input.parentNode?.replaceChild(span, input);
  });
}

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
    width: 1120,
    height: 790,
    windowWidth: 1200,
    windowHeight: 900,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc) => {
      const clonedEl = clonedDoc.getElementById(elementId);
      if (clonedEl) {
        prepareClonedCertificate(clonedEl);
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
    width: 1120,
    height: 790,
    windowWidth: 1200,
    windowHeight: 900,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc) => {
      const clonedEl = clonedDoc.getElementById(elementId);
      if (clonedEl) {
        prepareClonedCertificate(clonedEl);
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
