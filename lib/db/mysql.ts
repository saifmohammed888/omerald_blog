import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

/**
 * Get or create MySQL connection pool
 * Supports both DATABASE_URL connection string and individual environment variables
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    let connectionConfig: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    };

    // Check if DATABASE_URL is provided (connection string format)
    if (process.env.DATABASE_URL) {
      // Parse connection string: mysql://user:password@host:port/database
      const url = new URL(process.env.DATABASE_URL);
      connectionConfig = {
        host: url.hostname,
        port: parseInt(url.port) || 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1), // Remove leading '/'
      };
    } 
    // Otherwise, use individual environment variables
    else if (
      process.env.MYSQL_HOST &&
      process.env.MYSQL_USER &&
      process.env.MYSQL_PASSWORD &&
      process.env.MYSQL_DATABASE
    ) {
      connectionConfig = {
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      };
    } else {
      throw new Error(
        'Database configuration missing. Please provide either DATABASE_URL or MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE environment variables.'
      );
    }
    
    pool = mysql.createPool({
      ...connectionConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }

  return pool;
}

/**
 * Execute a query
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(sql, params || []);
    return rows as T[];
  } catch (error: any) {
    // Enhance error message with SQL context in development
    if (process.env.NODE_ENV === 'development') {
      console.error('SQL Error:', error.message);
      console.error('SQL Query:', sql);
      console.error('SQL Params:', params);
    }
    throw error;
  }
}

/**
 * Execute a query and return the first result
 */
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results[0] || null;
}

/**
 * Close the connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

