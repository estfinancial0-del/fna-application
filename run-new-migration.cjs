const mysql = require('mysql2/promise');
const fs = require('fs');

const DATABASE_URL = 'mysql://3gcNEttY7YdzcUo.root:L2QarHdQkbUvrdQC@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}';

async function runMigration() {
  console.log('Connecting to database with SSL...');
  
  const connection = await mysql.createConnection({
    uri: DATABASE_URL,
    ssl: {
      rejectUnauthorized: true
    }
  });
  
  console.log('Connected successfully!');
  
  try {
    // Read the migration file
    const migrationSQL = fs.readFileSync('/home/ubuntu/fna-application/drizzle/0002_faulty_mole_man.sql', 'utf8');
    
    console.log('Running migration: 0002_faulty_mole_man.sql');
    console.log('SQL:', migrationSQL);
    
    await connection.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the table was created
    const [tables] = await connection.query("SHOW TABLES LIKE 'payment_agreement'");
    if (tables.length > 0) {
      console.log('✓ payment_agreement table created successfully');
    } else {
      console.log('⚠ payment_agreement table not found');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

runMigration().catch(console.error);
