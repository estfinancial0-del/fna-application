import { getDb } from "./db";
import mysql from "mysql2/promise";

/**
 * Run database migrations
 * This function executes pending SQL migrations
 */
export async function runMigration() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Get the raw connection from the pool
    const pool = mysql.createPool({
      uri: process.env.DATABASE_URL!,
      ssl: {
        rejectUnauthorized: true
      }
    });

    const connection = await pool.getConnection();

    try {
      // Migration 0004: Add eftpos to payment method enum
      console.log("[Migration] Running migration 0004: Add eftpos payment method");
      
      await connection.query(`
        ALTER TABLE \`payment_agreement\` 
        MODIFY COLUMN \`paymentMethod\` ENUM('cash', 'cheque', 'credit_card', 'eftpos')
      `);

      console.log("[Migration] Migration 0004 completed successfully");
      
      return { success: true, message: "Migration completed successfully" };
    } finally {
      connection.release();
      await pool.end();
    }
  } catch (error: any) {
    console.error("[Migration] Failed to run migration:", error);
    
    // Check if the error is because the enum already has eftpos
    if (error.message && error.message.includes("Duplicate entry")) {
      return { success: true, message: "Migration already applied" };
    }
    
    throw error;
  }
}
