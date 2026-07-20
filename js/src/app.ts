import authPlugin from "@/hooks/auth.js";
import medicationsRoutes from "@/modules/medications/medications.routes.js";
import patientsRoutes from "@/modules/patients/patients.routes.js";
import vitalSignsRoutes from "@/modules/vital-signs/vital-signs.routes.js";
import dbPlugin from "@/plugins/db.js";
import envPlugin from "@/plugins/env.js";
import swaggerPlugin from "@/plugins/swagger.js";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";
import Fastify, { type FastifyError, type FastifyInstance } from "fastify";

export async function buildApp(): Promise<FastifyInstance> {
	const fastify = Fastify({
		logger:
			process.env.NODE_ENV === "development"
				? { transport: { target: "pino-pretty", options: { colorize: true } } }
				: true,
		ajv: {
			customOptions: {
				strict: "log",
				keywords: ["kind", "modifier"],
			},
		},
	});

	// 1. Env — must be first so fastify.config is available to all other plugins
	await fastify.register(envPlugin);

	// 2. Security plugins
	// CORS is only needed locally — the API gateway injects CORS headers in all other environments.
	if (process.env.NODE_ENV !== "production") {
		await fastify.register(cors, { origin: true, credentials: true });
	}

	// CSP is disabled globally — this is a backend API with no user-rendered HTML.
	// @fastify/swagger-ui's staticCSP option manages CSP for the /open/docs route on its own.
	await fastify.register(helmet, { contentSecurityPolicy: false });
	await fastify.register(rateLimit, {
		max: 100,
		timeWindow: "1 minute",
	});
	await fastify.register(sensible);

	// 3. Database
	await fastify.register(dbPlugin);

	// 4. API docs
	await fastify.register(swaggerPlugin);

	// 5. Auth decorator (decode-only — gateway validates the signature)
	await fastify.register(authPlugin);

	// Global error handler
	fastify.setErrorHandler((error: FastifyError, request, reply) => {
		request.log.error({ err: error }, "Unhandled error");
		const statusCode = error.statusCode ?? 500;
		reply.status(statusCode).send({
			statusCode,
			error: error.name,
			message: statusCode < 500 ? error.message : "Internal Server Error",
		});
	});

	// Health check — /open/* routes require no auth
	fastify.get(
		"/open/health",
		{
			schema: {
				summary: "Health check",
				description: "Returns service health status.",
				tags: ["health"],
				response: {
					200: {
						type: "object",
						properties: {
							status: { type: "string" },
							timestamp: { type: "string" },
						},
					},
				},
			},
		},
		async (_request, reply) => {
			reply.send({ status: "ok", timestamp: new Date().toISOString() });
		},
	);

	// Feature modules
	await fastify.register(patientsRoutes, { prefix: "/v1/patients" });
	await fastify.register(vitalSignsRoutes, { prefix: "/v1/patients/:patientId/vitals" });
	await fastify.register(medicationsRoutes, { prefix: "/v1/patients/:patientId/medications" });

	return fastify;
}
