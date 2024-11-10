import pg from 'pg'
const {Client} = pg

// Database connection - yucky singleton but deal with it (demo app)
export const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT) || 5432,
});

async function initDb(client: pg.Client) {
    // Initialize messages table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

export const setupDb = async () => {
    // Connect to PostgreSQL
    try {
        await client.connect()
        console.log('Connected to PostgreSQL');
        await initDb(client);
        console.log('Table created');
    } catch (error) {
        console.error('Postgres Client Error', error)
        throw error
    }
}
