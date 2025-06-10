import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',               // default localhost
  user: 'root',     // replace with your username
  password: 'root', // replace with your password
  database: 'ey_business_card_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
