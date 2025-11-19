/**
 * Microsoft Outlook Calendar Integration
 * Creates calendar events for FNA follow-ups using Microsoft Graph API
 */

interface CalendarEventData {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  advisorEmail: string;
  submissionId: number;
  appointmentDate?: Date;
}

interface CreateEventResult {
  success: boolean;
  eventId?: string;
  error?: string;
}

/**
 * Get Microsoft Graph API access token using client credentials flow
 */
async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const tenantId = process.env.MICROSOFT_TENANT_ID;

  if (!clientId || !clientSecret || !tenantId) {
    console.warn("[Outlook] Microsoft 365 credentials not configured");
    return null;
  }

  try {
    const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    });

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Outlook] Token request failed:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("[Outlook] Failed to get access token:", error);
    return null;
  }
}

/**
 * Create a calendar event in Outlook for FNA follow-up
 */
export async function createFnaFollowUpEvent(
  eventData: CalendarEventData
): Promise<CreateEventResult> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return {
      success: false,
      error: "Microsoft 365 credentials not configured or authentication failed",
    };
  }

  try {
    // Calculate follow-up date (48 hours from now, or use provided appointment date)
    const followUpDate = eventData.appointmentDate || new Date(Date.now() + 48 * 60 * 60 * 1000);
    const endDate = new Date(followUpDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    // Create event payload
    const event = {
      subject: `FNA Follow-up: ${eventData.clientName}`,
      body: {
        contentType: "HTML",
        content: `
          <h3>Financial Needs Analysis Follow-up</h3>
          <p><strong>Client:</strong> ${eventData.clientName}</p>
          ${eventData.clientEmail ? `<p><strong>Email:</strong> ${eventData.clientEmail}</p>` : ""}
          ${eventData.clientPhone ? `<p><strong>Phone:</strong> ${eventData.clientPhone}</p>` : ""}
          <p><strong>Submission ID:</strong> #${eventData.submissionId}</p>
          <p><strong>Action Required:</strong> Review the FNA submission and contact the client to schedule a consultation.</p>
          <p><a href="${process.env.VITE_APP_URL || "https://fna.est.com.au"}/admin/fna/${eventData.submissionId}">View FNA Details</a></p>
          <p><em>EST Financial - Financial Needs Analysis</em></p>
        `,
      },
      start: {
        dateTime: followUpDate.toISOString(),
        timeZone: "AUS Eastern Standard Time",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "AUS Eastern Standard Time",
      },
      location: {
        displayName: "Phone/Video Call",
      },
      attendees: [
        {
          emailAddress: {
            address: eventData.advisorEmail,
            name: "Advisor",
          },
          type: "required",
        },
      ],
      reminderMinutesBeforeStart: 1440, // 24 hours before
      isReminderOn: true,
      categories: ["FNA Follow-up", "Client Meeting"],
    };

    // Create event using Microsoft Graph API
    // Note: This requires the advisor's mailbox or a shared calendar
    const calendarEndpoint = `https://graph.microsoft.com/v1.0/users/${eventData.advisorEmail}/calendar/events`;

    const response = await fetch(calendarEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Outlook] Event creation failed:", response.status, errorText);
      return {
        success: false,
        error: `Failed to create calendar event: ${response.status}`,
      };
    }

    const result = await response.json();
    console.log("[Outlook] Calendar event created successfully:", result.id);

    return {
      success: true,
      eventId: result.id,
    };
  } catch (error) {
    console.error("[Outlook] Failed to create calendar event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
