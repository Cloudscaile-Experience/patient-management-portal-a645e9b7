import fastifyEnv from "@fastify/env";
import { type Static, Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

export const EnvSchema = Type.Object({
	NODE_ENV: Type.String({ default: "development" }),
	TENANT_NAME: Type.String({ default: "cloudscaile" }),
	EXTENSION_NAME: Type.String({ default: "patientManagementPortal" }),
	PORT: Type.Integer({ default: 8000 }),
	HOST: Type.String({ default: "0.0.0.0" }),
	PG_HOST: Type.String({ default: "localhost" }),
	PG_PORT: Type.Integer({ default: 5432 }),
	PG_USERNAME: Type.String(),
	PG_PASSWORD: Type.String(),
	PG_DB: Type.String(),
	GATEWAY_BASE_URL: Type.Optional(Type.String()),
});

export type EnvConfig = Static<typeof EnvSchema>;

declare module "fastify" {
	interface FastifyInstance {
		config: EnvConfig;
	}
}

const envPlugin: FastifyPluginAsync = async (fastify) => {
	await fastify.register(fastifyEnv, {
		schema: EnvSchema,
		dotenv: true,
	});
};

export default fp(envPlugin, {
	name: "env",
	fastify: "5.x",
});
