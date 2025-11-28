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
    },
    multipleStatements: true
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
      
      try {
        await connection.query(sql);
        console.log(`✓ ${file} executed successfully`);
      } catch (error) {
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`⚠ ${file} - Tables already exist, skipping`);
        } else {
          console.error(`✗ Error in ${file}:`, error.message);
          throw error;
        }
      }
    }
  }

  // Verify tables were created
  console.log('\nVerifying tables...');
  const [tables] = await connection.query('SHOW TABLES');
  console.log(`\n✓ Found ${tables.length} tables:`);
  tables.forEach(table => {
    console.log(`  - ${Object.values(table)[0]}`);
  });

  await connection.end();
  console.log('\n✓ Migrations completed successfully!');
}

runMigrations().catch(error => {
  console.error('\n✗ Migration failed:', error);
  process.exit(1);
});
