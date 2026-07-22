const fs = require('fs');
const { Pool } = require('pg');
const env = fs.readFileSync('.env', 'utf8');
const dbUrl = env.split('\n').find(line => line.startsWith('DATABASE_URL=')).split('=')[1].trim().replace(/['"]/g, '');

const pool = new Pool({ connectionString: dbUrl });
pool.query('SELECT NOW()').then(res => {
  console.log('Connected to PG successfully:', res.rows[0]);
  process.exit(0);
}).catch(err => {
  console.error('Error connecting:', err);
  process.exit(1);
});
