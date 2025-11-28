import { jsPDF } from "jspdf";

/**
 * Check if we need a page break and add one if necessary
 * @param doc - jsPDF document
 * @param currentY - Current Y position
 * @param requiredSpace - Space needed for next content (in mm)
 * @param margin - Top margin for new pages
 * @returns New Y position after potential page break
 */
export function checkPageBreak(
  doc: jsPDF,
  currentY: number,
  requiredSpace: number = 40,
  margin: number = 15
): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomMargin = 20; // Leave 20mm at bottom for page number
  
  if (currentY + requiredSpace > pageHeight - bottomMargin) {
    doc.addPage();
    return margin;
  }
  
  return currentY;
}

/**
 * Add page footer with page number
 * @param doc - jsPDF document
 * @param pageNumber - Current page number
 * @param totalPages - Total number of pages
 */
export function addPageFooter(doc: jsPDF, pageNumber: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Page ${pageNumber} of ${totalPages}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );
  
  doc.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    pageWidth - 15,
    pageHeight - 10,
    { align: "right" }
  );
}
