import pg from "pg";
process.loadEnvFile();
const { Pool, Client } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
});

export async function query(text: string, params?: any[] | undefined) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(
            `[DB Query] Executed in ${duration}ms | Command : ${res.command}`
        );
        return res;
    } catch (error) {
        if (error instanceof Error) console.log(`[DB Error]`, error.message);
    }
}
export async function close() {
    await pool.end();
}

export default { query, close };
