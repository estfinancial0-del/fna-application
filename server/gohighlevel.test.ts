import { describe, expect, it } from "vitest";
import { syncContactToGoHighLevel, triggerWorkflow } from "./gohighlevel";

describe("GoHighLevel Integration", () => {
  it("should have valid API credentials configured", async () => {
    // Test with minimal contact data
    const testContact = {
      firstName: "Test",
      lastName: "Contact",
      email: "test@example.com",
      phone: "+61400000000",
      tags: ["Test"],
    };

    const result = await syncContactToGoHighLevel(testContact);

    // Should either succeed or fail with a specific API error (not a config error)
    expect(result.success || result.error?.includes("API error")).toBe(true);
    
    // Should not fail due to missing credentials
    expect(result.error).not.toContain("credentials not configured");
  }, 10000); // 10 second timeout for API call

  it("should have workflow ID configured", async () => {
    // Verify workflow ID is set
    const workflowId = process.env.GOHIGHLEVEL_WORKFLOW_ID;
    expect(workflowId).toBeDefined();
    expect(workflowId).not.toBe("");
    
    console.log("[Test] Workflow ID configured:", workflowId);
  });

  it("should trigger workflow with valid contact ID", async () => {
    // Note: This test uses a dummy contact ID since we can't create a real contact in tests
    // In production, the contact ID comes from the syncContactToGoHighLevel result
    const dummyContactId = "test_contact_id_123";
    
    const result = await triggerWorkflow(dummyContactId);
    
    // Should either succeed or fail with API error (not config error)
    // Note: Will likely fail with API error since dummy contact doesn't exist
    expect(result.success || result.error?.includes("Workflow trigger failed")).toBe(true);
    
    // Should not fail due to missing credentials or workflow ID
    expect(result.error).not.toContain("credentials not configured");
    expect(result.error).not.toContain("Workflow ID not configured");
  }, 10000);
});
