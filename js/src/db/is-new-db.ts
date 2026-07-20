import "dotenv/config";
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

// Exits 0 (true) when the patients table has no rows yet — a fresh database
// that still needs seed data. Exits 1 (false) when it already holds data, or
// when the check itself fails, so a broken migration never masks itself as a
// green light to seed.
async function isNewDatabase(): Promise<boolean> {
	const result = await pool.query<{ count: string }>(
		"SELECT COUNT(*)::text AS count FROM patients",
	);
	return result.rows[0]?.count === "0";
}

isNewDatabase()
	.then((isNew) => {
		process.stdout.write(isNew ? "empty\n" : "seeded\n");
		process.exitCode = isNew ? 0 : 1;
	})
	.catch((err) => {
		process.stderr.write(`Could not determine database state: ${String(err)}\n`);
		process.exitCode = 1;
	})
	.finally(() => pool.end());
