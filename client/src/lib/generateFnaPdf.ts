import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency, formatPhone, formatABN, formatDate } from "./formatters";

interface FnaData {
  clientDetails: any;
  wealthCreation: any;
  wealthProtection: any;
  lifestyle: any;
  retirement: any;
  personalDetails1: any;
  personalDetails2: any | null;
  dependents: any[];
  assets: any[];
  riskManagement: any[];
  expenses: any[];
}

export function generateFnaPdf(data: FnaData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(220, 38, 38); // EST Financial red
  doc.text("Financial Needs Analysis", pageWidth / 2, yPos, { align: "center" });
  
  yPos += 10;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("EST Financial", pageWidth / 2, yPos, { align: "center" });
  
  yPos += 15;
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  yPos += 15;

  // Client Details Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Client Information", 20, yPos);
  yPos += 10;

  const clientInfo = [
    ["Client Name", data.clientDetails?.clientName || "N/A"],
    ["Email", data.clientDetails?.email || "N/A"],
    ["Phone", formatPhone(data.clientDetails?.phone)],
    ["Client Manager", data.clientDetails?.clientManager || "N/A"],
    ["Appointment Date", formatDate(data.clientDetails?.appointmentDate)],
    ["Appointment Fee", formatCurrency(data.clientDetails?.appointmentFee)],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: clientInfo,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: "auto" },
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Financial Goals Section
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.text("Financial Goals", 20, yPos);
  yPos += 10;

  if (data.wealthCreation) {
    doc.setFontSize(12);
    doc.setTextColor(220, 38, 38);
    doc.text("Wealth Creation", 20, yPos);
    yPos += 7;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    const wealthCreationGoals = [
      ["Save for a goal", data.wealthCreation.saveForGoal || "N/A"],
      ["Pay off debt", data.wealthCreation.payOffDebt || "N/A"],
      ["Reduce tax", data.wealthCreation.reduceTax || "N/A"],
      ["Retirement planning", data.wealthCreation.retirementPlanning || "N/A"],
      ["Invest money", data.wealthCreation.investMoney || "N/A"],
      ["Investment property", data.wealthCreation.investProperty || "N/A"],
    ];

    autoTable(doc, {
      startY: yPos,
      body: wealthCreationGoals,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: "auto" },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  if (data.wealthProtection) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(220, 38, 38);
    doc.text("Wealth Protection", 20, yPos);
    yPos += 7;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    const wealthProtectionGoals = [
      ["Family security", data.wealthProtection.familySecure || "N/A"],
      ["Manage sickness/injury", data.wealthProtection.manageSickness || "N/A"],
      ["Inheritance planning", data.wealthProtection.inheritance || "N/A"],
    ];

    autoTable(doc, {
      startY: yPos,
      body: wealthProtectionGoals,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: "auto" },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Retirement Planning Section
  if (data.retirement) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text("Retirement Planning", 20, yPos);
    yPos += 10;

    const retirementInfo = [
      ["Estimated Retirement Age", data.retirement.estimatedRetirementAge?.toString() || "N/A"],
      ["Current Age", data.retirement.currentAge?.toString() || "N/A"],
      ["Desired Yearly Income", formatCurrency(data.retirement.desiredYearlyIncome)],
      ["Superannuation", formatCurrency(data.retirement.superannuation)],
      ["Savings", formatCurrency(data.retirement.savings)],
      ["Shares/Bonds", formatCurrency(data.retirement.sharesBonds)],
      ["Equity (Not Home)", formatCurrency(data.retirement.equityNotHome)],
      ["Other Assets", formatCurrency(data.retirement.otherAssets)],
    ];

    autoTable(doc, {
      startY: yPos,
      body: retirementInfo,
      theme: "striped",
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 70 },
        1: { cellWidth: "auto" },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Financial Dependents Section
  if (data.dependents && data.dependents.length > 0) {
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text("Financial Dependents", 20, yPos);
    yPos += 10;

    const dependentsData = data.dependents.map((dep) => [
      dep.name || "N/A",
      dep.relationship || "N/A",
      dep.age?.toString() || "N/A",
      dep.sex || "N/A",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Name", "Relationship", "Age", "Sex"]],
      body: dependentsData,
      theme: "striped",
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Assets Section
  if (data.assets && data.assets.length > 0) {
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text("Assets & Liabilities", 20, yPos);
    yPos += 10;

    const assetsData = data.assets.map((asset) => [
      asset.assetType || "N/A",
      formatCurrency(asset.valueOfAsset),
      formatCurrency(asset.amountOwing),
      formatCurrency(asset.repayment),
      asset.frequency || "N/A",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Asset Type", "Value", "Amount Owing", "Repayment", "Frequency"]],
      body: assetsData,
      theme: "striped",
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 9, cellPadding: 2 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Risk Management Section
  if (data.riskManagement && data.riskManagement.length > 0) {
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text("Risk Management / Insurance", 20, yPos);
    yPos += 10;

    const riskData = data.riskManagement.map((risk) => [
      risk.clientNumber === 1 ? "Client 1" : "Client 2",
      risk.insuranceType || "N/A",
      formatCurrency(risk.coverAmount),
      risk.insurer || "N/A",
      risk.policyNumber || "N/A",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Client", "Type", "Cover Amount", "Insurer", "Policy #"]],
      body: riskData,
      theme: "striped",
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 9, cellPadding: 2 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      pageWidth - 20,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }

  // Save the PDF
  const fileName = `FNA_${data.clientDetails?.clientName?.replace(/\s+/g, "_") || "Report"}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  
  doc.save(fileName);
}
