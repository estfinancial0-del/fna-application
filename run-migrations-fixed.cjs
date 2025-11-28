const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  console.log('Connecting to database with SSL...');
  
  // Create connection with SSL
  const connection = await mysql.createConnection({
    uri: connectionString,
    ssl: {
      rejectUnauthorized: true
    }
  });

  console.log('Connected successfully!');

  // Read and execute migration files
  const migrationFiles = [
    'drizzle/0000_wealthy_tarantula.sql',
    'drizzle/0001_closed_firestar.sql'
  ];

  for (const file of migrationFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`\nRunning migration: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split by statement breakpoint comments and filter out empty statements
      const statements = sql
        .split('--> statement-breakpoint')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      console.log(`  Found ${statements.length} SQL statements`);
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        try {
          await connection.query(statement);
          console.log(`  ✓ Statement ${i + 1}/${statements.length} executed`);
        } catch (error) {
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.sqlMessage?.includes('already exists')) {
            console.log(`  ⚠ Statement ${i + 1}/${statements.length} - Table already exists, skipping`);
          } else {
            console.error(`  ✗ Error in statement ${i + 1}:`, error.message);
            throw error;
          }
        }
      }
      
      console.log(`✓ ${file} completed`);
    }
  }

  // Verify tables were created
  console.log('\nVerifying tables...');
  const [tables] = await connection.query('SHOW TABLES');
  console.log(`\n✓ Found ${tables.length} tables in database:`);
  tables.forEach(table => {
    console.log(`  - ${Object.values(table)[0]}`);
  });

  await connection.end();
  console.log('\n✅ All migrations completed successfully!');
}

runMigrations().catch(error => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});
