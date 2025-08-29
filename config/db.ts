// /config/db.ts
import { ENV } from '@/env';
import mysql from 'mysql2';

type QueryResult = {
  insertId?: number;
  affectedRows?: number;
  [key: string]: any; 
};

const pool = mysql.createPool({
  host: ENV.DB_HOST,
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('MySQL connected successfully!');
    connection.release(); // release the connection back to the pool
  }
});

export const query = (sql: string, values?: any[]): Promise<QueryResult> => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};

export default pool;
