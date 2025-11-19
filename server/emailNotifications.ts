import { notifyOwner } from "./_core/notification";

interface FnaSubmissionData {
  clientName: string;
  email: string;
  phone: string;
  clientManager: string;
  submissionId: number;
}

/**
 * Send email notification to the advisor/owner when a new FNA is submitted
 */
export async function notifyAdvisorOfNewFna(data: FnaSubmissionData): Promise<boolean> {
  const title = `New FNA Submission from ${data.clientName}`;
  
  const content = `
A new Financial Needs Analysis has been submitted.

**Client Details:**
- Name: ${data.clientName}
- Email: ${data.email}
- Phone: ${data.phone}
- Assigned Manager: ${data.clientManager}
- Submission ID: #${data.submissionId}

Please review the submission in your admin dashboard.
  `.trim();

  try {
    const result = await notifyOwner({ title, content });
    return result;
  } catch (error) {
    console.error("Failed to send advisor notification:", error);
    return false;
  }
}

/**
 * Log client confirmation (in production, this would send an actual email)
 * For now, we'll just log it since we don't have an email service configured
 */
export function logClientConfirmation(data: FnaSubmissionData): void {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║           CLIENT CONFIRMATION EMAIL (LOGGED)                   ║
╠════════════════════════════════════════════════════════════════╣
║ To: ${data.email.padEnd(58)}║
║ Subject: Your Financial Needs Analysis Submission             ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ Dear ${data.clientName},                                      ║
║                                                                ║
║ Thank you for completing your Financial Needs Analysis with   ║
║ EST Financial. We have received your submission (#${String(data.submissionId).padEnd(13)}) ║
║                                                                ║
║ Your assigned financial advisor, ${data.clientManager}, will  ║
║ review your information and contact you within 24-48 hours    ║
║ to schedule your consultation.                                ║
║                                                                ║
║ If you have any questions, please don't hesitate to reach     ║
║ out to us.                                                     ║
║                                                                ║
║ Best regards,                                                  ║
║ EST Financial Team                                             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
}
