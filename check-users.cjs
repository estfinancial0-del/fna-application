const mysql = require('mysql2/promise');

async function checkUsers() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true }
  });
  
  const [rows] = await connection.execute('SELECT id, openId, name, email, role FROM users');
  console.log('Current users in database:');
  console.log(JSON.stringify(rows, null, 2));
  
  await connection.end();
}

checkUsers().catch(console.error);
