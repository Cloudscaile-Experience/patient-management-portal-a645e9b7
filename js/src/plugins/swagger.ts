import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

type OpenApiOperation = {
	security?: Array<Record<string, string[]>>;
	responses?: unknown;
};

type OpenApiPathItem = Record<string, OpenApiOperation>;

type OpenApiDocument = {
	paths?: Record<string, OpenApiPathItem>;
};

const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "options", "head"] as const;

function buildServers(gatewayBaseUrl?: string): Array<{ url: string; description: string }> {
	const servers: Array<{ url: string; description: string }> = [
		{
			url: "/",
			description: "Local Development Server",
		},
	];

	if (gatewayBaseUrl) {
		servers.push({
			url: gatewayBaseUrl,
			description: "API Gateway",
		});
	}

	return servers;
}

const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
	await fastify.register(swagger, {
		openapi: {
			openapi: "3.0.3",
			info: {
				title: "Patient Management Portal API",
				description: "REST API for managing patients, appointments, and medical records.",
				version: "1.0.0",
				contact: {
					name: "API Support",
					email: "devops@cloudscaile.com",
				},
			},
			servers: buildServers(fastify.config.GATEWAY_BASE_URL),
			components: {
				securitySchemes: {
					Bearer: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
						description:
							"JWT token forwarded from the API gateway. The gateway validates the signature; this service only reads the payload.",
					},
					ApiKeyAuth: {
						type: "apiKey",
						in: "header",
						name: "x-api-key",
						description: "API key for public API endpoints.",
					},
				},
			},
			tags: [
				{ name: "health", description: "Health and readiness checks" },
				{ name: "patients", description: "Patient management endpoints" },
			],
		},
		transformObject(documentObject) {
			// SwaggerDocumentObject is a discriminated union:
			// { swaggerObject } for OpenAPI v2 · { openapiObject } for OpenAPI v3
			if (!("openapiObject" in documentObject)) {
				return documentObject.swaggerObject;
			}

			const doc = documentObject.openapiObject as unknown as OpenApiDocument;

			for (const [path, pathItem] of Object.entries(doc.paths ?? {})) {
				for (const method of HTTP_METHODS) {
					const operation = pathItem[method];
					if (!operation?.responses) {
						continue;
					}

					if (path.startsWith("/v1/")) {
						// Protected routes — JWT forwarded from the gateway
						if (!operation.security) {
							operation.security = [];
						}
						operation.security.push({ Bearer: [] });
					}
				}
			}

			return documentObject.openapiObject;
		},
	});

	await fastify.register(swaggerUi, {
		routePrefix: "/open/docs",
		uiConfig: {
			docExpansion: "list",
			deepLinking: true,
			displayRequestDuration: true,
		},
		staticCSP: false,
	});
};

export default fp(swaggerPlugin, {
	name: "swagger",
	fastify: "5.x",
	dependencies: ["env"],
});
