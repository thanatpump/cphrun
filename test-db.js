const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '199.21.175.109',
      user: 'cphrun',
      password: 'pydKN2512',
      database: 'cphrun'
    });
    
    console.log('Successfully connected to database!');
    
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Tables in database:', rows);
    
    await connection.end();
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testConnection(); 