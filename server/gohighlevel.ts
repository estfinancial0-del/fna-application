/**
 * GoHighLevel CRM Integration
 * Syncs FNA submissions as contacts in GoHighLevel
 */

const GOHIGHLEVEL_API_URL = "https://services.leadconnectorhq.com";

interface ContactData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, string>;
  source?: string;
}

/**
 * Create or update a contact in GoHighLevel
 */
export async function syncContactToGoHighLevel(
  contactData: ContactData
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const apiKey = process.env.GOHIGHLEVEL_API_KEY;
  const locationId = process.env.GOHIGHLEVEL_LOCATION_ID;

  if (!apiKey || !locationId) {
    console.warn("[GoHighLevel] API credentials not configured");
    return {
      success: false,
      error: "GoHighLevel credentials not configured",
    };
  }

  try {
    // Create contact payload
    const payload = {
      locationId,
      firstName: contactData.firstName || "",
      lastName: contactData.lastName || "",
      email: contactData.email || "",
      phone: contactData.phone || "",
      tags: contactData.tags || ["FNA Submission"],
      source: contactData.source || "FNA Application",
    };

    // Call GoHighLevel API to create/update contact
    const response = await fetch(`${GOHIGHLEVEL_API_URL}/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Version": "2021-07-28",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[GoHighLevel] API error:", response.status, errorText);
      return {
        success: false,
        error: `GoHighLevel API error: ${response.status}`,
      };
    }

    const result = await response.json();
    console.log("[GoHighLevel] Contact synced successfully:", result.contact?.id);

    return {
      success: true,
      contactId: result.contact?.id,
    };
  } catch (error) {
    console.error("[GoHighLevel] Sync failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Trigger a GoHighLevel workflow to send notifications to the contact
 * @param contactId - The GoHighLevel contact ID
 * @param workflowId - The workflow ID to trigger (optional, uses default if not provided)
 */
export async function triggerWorkflow(
  contactId: string,
  workflowId?: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.GOHIGHLEVEL_API_KEY;
  const locationId = process.env.GOHIGHLEVEL_LOCATION_ID;
  
  // Use environment variable for workflow ID if not provided
  const targetWorkflowId = workflowId || process.env.GOHIGHLEVEL_WORKFLOW_ID;

  if (!apiKey || !locationId) {
    console.warn("[GoHighLevel] API credentials not configured");
    return {
      success: false,
      error: "GoHighLevel credentials not configured",
    };
  }

  if (!targetWorkflowId) {
    console.warn("[GoHighLevel] Workflow ID not configured");
    return {
      success: false,
      error: "Workflow ID not configured",
    };
  }

  try {
    // Trigger the workflow for the contact
    const response = await fetch(
      `${GOHIGHLEVEL_API_URL}/workflows/${targetWorkflowId}/subscribe`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Version": "2021-07-28",
        },
        body: JSON.stringify({
          contactId,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[GoHighLevel] Workflow trigger error:", response.status, errorText);
      return {
        success: false,
        error: `Workflow trigger failed: ${response.status}`,
      };
    }

    const result = await response.json();
    console.log("[GoHighLevel] Workflow triggered successfully:", result);

    return {
      success: true,
    };
  } catch (error) {
    console.error("[GoHighLevel] Workflow trigger failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Extract contact data from FNA submission
 */
export function extractContactFromFNA(fnaData: {
  clientName?: string;
  email?: string;
  phone?: string;
}): ContactData {
  // Parse client name into first and last name
  const nameParts = (fnaData.clientName || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    firstName,
    lastName,
    email: fnaData.email || "",
    phone: fnaData.phone || "",
    tags: ["FNA Submission", "Financial Planning Lead"],
    source: "FNA Web Application",
  };
}
