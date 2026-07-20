import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema/index.ts",
	out: "./drizzle/migrations",
	dbCredentials: {
		host: process.env.PG_HOST ?? "localhost",
		port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
		user: process.env.PG_USERNAME ?? "",
		password: process.env.PG_PASSWORD ?? "",
		database: process.env.PG_DB ?? "",
		ssl: false,
	},
	verbose: true,
	strict: true,
});
