const mysql = require('mysql2/promise');

const DATABASE_URL = 'mysql://3gcNEttY7YdzcUo.root:L2QarHdQkbUvrdQC@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test';

async function runMigration() {
  const connection = await mysql.createConnection({
    uri: DATABASE_URL,
    ssl: {
      rejectUnauthorized: true
    }
  });

  try {
    console.log('Running signature field migration...');
    
    await connection.query('ALTER TABLE `payment_agreement` MODIFY COLUMN `clientSignature1` text');
    console.log('✓ Updated clientSignature1 to text');
    
    await connection.query('ALTER TABLE `payment_agreement` MODIFY COLUMN `clientSignature2` text');
    console.log('✓ Updated clientSignature2 to text');
    
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

runMigration();
