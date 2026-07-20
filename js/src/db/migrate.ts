import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const pgHost = process.env.PG_HOST;
const pgPort = process.env.PG_PORT;
const pgUsername = process.env.PG_USERNAME;
const pgPassword = process.env.PG_PASSWORD;
const pgDatabase = process.env.PG_DB;

for (const [key, val] of Object.entries({
	PG_HOST: pgHost,
	PG_PORT: pgPort,
	PG_USERNAME: pgUsername,
	PG_PASSWORD: pgPassword,
	PG_DB: pgDatabase,
})) {
	if (!val) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
}

const pool = new Pool({
	host: pgHost,
	port: pgPort ? Number(pgPort) : 5432,
	user: pgUsername,
	password: pgPassword,
	database: pgDatabase,
});
const db = drizzle(pool);

async function runMigrations(): Promise<void> {
	process.stdout.write("Running migrations...\n");
	await migrate(db, { migrationsFolder: "./drizzle/migrations" });
	process.stdout.write("Migrations complete.\n");
	await pool.end();
}

runMigrations().catch((err) => {
	process.stderr.write(`Migration failed: ${String(err)}\n`);
	process.exit(1);
});
