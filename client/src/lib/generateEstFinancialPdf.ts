import jsPDF from "jspdf";
import { formatCurrency, formatPhone, formatDate, formatABN, formatPostcode } from "./formatters";

interface FnaData {
  clientDetails?: {
    clientName?: string;
    clientManager?: string;
    phone?: string;
    email?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    appointmentLocation?: string;
    appointmentFee?: number;
  };
  wealthCreation?: any;
  wealthProtection?: any;
  lifestyleAspirations?: any;
  retirementPlanning?: any;
  personalDetails?: any;
  assets?: any;
  selfEmployment?: any;
  expenses?: any;
}

/**
 * Generate EST Financial branded PDF matching the original document design
 */
export async function generateEstFinancialPdf(data: FnaData): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors
  const estRed = [220, 38, 38]; // #DC2626
  const darkGray = [100, 100, 100];
  const lightGray = [240, 240, 240];
  const tableGray = [128, 128, 128];

  let currentPage = 1;

  // ============================================================================
  // COVER PAGE (Page 1) - Black background with white text
  // ============================================================================
  
  // Black background
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // EST logo (red, top left)
  doc.setFontSize(48);
  doc.setTextColor(estRed[0], estRed[1], estRed[2]);
  doc.setFont("helvetica", "bold");
  doc.text("est.", 20, 40);

  // Title in script-style font (white, centered)
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "italic");
  doc.setFontSize(56);
  doc.text("Financial", pageWidth / 2, 100, { align: "center" });
  doc.text("Needs", pageWidth / 2, 140, { align: "center" });
  doc.text("Analysis", pageWidth / 2, 180, { align: "center" });

  // Footer text
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("2025 EST CAPITAL PTY LTD ABN 682 086 577", 20, pageHeight - 10);

  // ============================================================================
  // PAGE 2 - Client Details
  // ============================================================================
  
  doc.addPage();
  currentPage++;

  // Add header to all content pages
  addPageHeader(doc, "Client Details", "*PRIVATE & CONFIDENTIAL*", currentPage);

  let yPos = 60;

  // Client Details Table
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(20, yPos, pageWidth - 40, 80, "F");
  doc.setDrawColor(0, 0, 0);
  doc.rect(20, yPos, pageWidth - 40, 80);

  const fields = [
    ["Client", data.clientDetails?.clientName || ""],
    ["Client Manager", data.clientDetails?.clientManager || ""],
    ["Phone", data.clientDetails?.phone ? formatPhone(data.clientDetails.phone) : ""],
    ["Email", data.clientDetails?.email || ""],
    ["Date of Appointment", data.clientDetails?.appointmentDate ? formatDate(data.clientDetails.appointmentDate) : ""],
    ["Time of Appointment", data.clientDetails?.appointmentTime || ""],
  ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  fields.forEach((field, index) => {
    const fieldY = yPos + 10 + (index * 13);
    // Draw horizontal line
    if (index > 0) {
      doc.line(20, fieldY - 3, pageWidth - 20, fieldY - 3);
    }
    // Label
    doc.text(field[0], 25, fieldY);
    // Value
    doc.setFont("helvetica", "normal");
    doc.text(field[1], 100, fieldY);
    doc.setFont("helvetica", "bold");
  });

  yPos += 90;

  // Introductory text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const introText = [
    "In order to provide you with the best possible guidance, it is vital that we",
    "build an understanding of your current situation and the areas in which we",
    "can best be of assistance.",
    "",
    "This questionnaire represents the first step on your financial journey, and",
    "its purpose is twofold:",
    "",
    "1. It will help us to prepare for our initial appointment, as it ensures that",
    "we have an understanding of your situation.",
    "",
    "2. It may also help identify other issues that you may not have considered",
    "and can therefore be discussed with your est Client Manager.",
    "",
    "The Team at est will gather further information at your initial meeting. If",
    "you are completing this questionnaire as a couple, we ask that you provide",
    "a joint response. If there are differences in some of your responses, you",
    "may wish to initial them so they can be discussed further.",
  ];

  introText.forEach((line, index) => {
    doc.text(line, 20, yPos + (index * 5));
  });

  // EST logo at bottom right
  doc.setFontSize(24);
  doc.setTextColor(estRed[0], estRed[1], estRed[2]);
  doc.setFont("helvetica", "bold");
  doc.text("est.", pageWidth - 30, pageHeight - 15);

  // ============================================================================
  // PAGE 3 - Wealth Creation & Protection Goals
  // ============================================================================
  
  doc.addPage();
  currentPage++;
  addPageHeader(doc, "Wealth Creation", "", currentPage);

  yPos = 60;

  // Create importance table
  createImportanceTable(doc, yPos, "Wealth Creation", [
    "I need to save more money for a specific goal (e.g. a house, car or child(ren)'s education)",
    "I am interested in paying off my personal debts more quickly",
    "I would like to reduce the amount of tax I currently pay",
    "I would like to know if I am packaging my salary effectively",
    "I would like to take more control of my superannuation",
    "Ii would like to know how to best invest my money",
    "I would like to consider an investment in shares/managed funds",
    "I would like to consider an investment in property",
    "I want to start planning for a financially secure retirement",
    "I want to know more about Centrelink benefits",
    "I would like to make my money last longer in retirement",
    "I need to save more money for a specific goal (e.g. a house, car or child(ren)'s education)",
  ], data.wealthCreation);

  yPos += 100;

  // Wealth Protection table
  createImportanceTable(doc, yPos, "Wealth Protection", [
    "I want to ensure my family is financially secure if I die or suffer a serious illness",
    "I am unsure how I will manage financially if I am sick for a prolonged period",
    "I want to ensure the right people will inherit my assets when I die",
    "My employment status has recently changed, or is changing soon",
    "A recent event has prompted me to seek financial advice",
    "My family situation has recently changed, or is about to change",
  ], data.wealthProtection);

  // ============================================================================
  // Helper Functions
  // ============================================================================

  function addPageHeader(doc: jsPDF, title: string, subtitle: string, pageNum: number) {
    // EST logo top left
    doc.setFontSize(24);
    doc.setTextColor(estRed[0], estRed[1], estRed[2]);
    doc.setFont("helvetica", "bold");
    doc.text("est.", 20, 20);

    // Page title (script font, top right)
    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(title, pageWidth - 20, 20, { align: "right" });
    
    // Page number
    doc.setFontSize(12);
    doc.text(String(pageNum).padStart(2, "0"), pageWidth - 20, 26, { align: "right" });

    // Subtitle if provided
    if (subtitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(subtitle, pageWidth / 2, 35, { align: "center" });
    }

    // Horizontal line under header
    doc.setDrawColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 30, pageWidth - 20, 30);
  }

  function createImportanceTable(
    doc: jsPDF,
    startY: number,
    sectionTitle: string,
    items: string[],
    data: any
  ) {
    const colWidth = 40;
    const rowHeight = 8;

    // Section header (gray background, white text)
    doc.setFillColor(tableGray[0], tableGray[1], tableGray[2]);
    doc.rect(20, startY, 80, rowHeight, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(sectionTitle, 25, startY + 5.5);

    // Column headers (red background, white text)
    const headers = ["Important", "Interested", "Not Important"];
    headers.forEach((header, index) => {
      const x = 100 + (index * colWidth);
      doc.setFillColor(estRed[0], estRed[1], estRed[2]);
      doc.rect(x, startY, colWidth, rowHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(header, x + colWidth / 2, startY + 5.5, { align: "center" });
    });

    // Table rows
    items.forEach((item, index) => {
      const y = startY + rowHeight + (index * rowHeight);
      
      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, y, pageWidth - 40, rowHeight, "F");
      }

      // Item text
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const splitText = doc.splitTextToSize(item, 75);
      doc.text(splitText, 25, y + 5);

      // Checkboxes
      headers.forEach((_, colIndex) => {
        const x = 100 + (colIndex * colWidth);
        doc.setDrawColor(200, 200, 200);
        doc.rect(x + colWidth / 2 - 2, y + 2, 4, 4);
        
        // Add checkmark if data indicates this option is selected
        // (You'll need to implement the logic based on your data structure)
      });
    });
  }

  return doc;
}
