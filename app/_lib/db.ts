import mysql from 'mysql2/promise';

export const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 25777,
}

export async function query<T>(query: string, values: any[] = []): Promise<T> {
  const conn = await mysql.createConnection(connectionConfig);
  try {
    const [result] = await conn.execute(query, values);
    return result as T;
  } catch (err: any) {
    console.error(err.message);
    throw new Error('database error.');
  } finally {
    conn.end();
  }
}