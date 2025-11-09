import mysql from 'mysql2/promise'

// Database connection configuration from environment variables
// Next.js automatically loads .env file, but variables must be available at build/runtime
const dbConfig = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || process.env.DB_HOST_1 || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || process.env.DB_PORT_2 || '3306'),
  user: process.env.MYSQL_USER || process.env.DB_USER || process.env.DB_USER_3 || 'root',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || process.env.DB_PASSWORD_4 || '',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || process.env.DB_NAME_5 || 'medinlife',
}

// Log configuration (without password) for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Database Config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database,
    hasPassword: !!dbConfig.password,
  })
}

// Validate required configuration
if (!dbConfig.password && process.env.NODE_ENV === 'production') {
  console.warn('Warning: DB_PASSWORD is not set. This may cause connection issues.')
}

// Create a connection pool for better performance
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function query(sql: string, params?: any[]) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export default pool

