import * as schema from "@/db/schema/index.js";
import { drizzle } from "drizzle-orm/node-postgres";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";

const dbPlugin: FastifyPluginAsync = async (fastify) => {
	const pool = new Pool({
		host: fastify.config.PG_HOST,
		port: fastify.config.PG_PORT,
		user: fastify.config.PG_USERNAME,
		password: fastify.config.PG_PASSWORD,
		database: fastify.config.PG_DB,
	});

	const db = drizzle(pool, { schema });

	fastify.decorate("db", db);

	fastify.addHook("onClose", async () => {
		fastify.log.info("Closing database connection pool...");
		await pool.end();
	});
};

export default fp(dbPlugin, {
	name: "db",
	fastify: "5.x",
	dependencies: ["env"],
});
