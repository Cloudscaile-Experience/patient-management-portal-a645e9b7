import type { JwtPayload } from "@/types/index.js";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

// Decodes a JWT payload without verifying the signature.
// The API gateway upstream is responsible for signature validation.
function decodeJwtPayload(token: string): JwtPayload {
	const [, payloadSegment, signature] = token.split(".");
	if (!payloadSegment || signature === undefined) {
		throw new Error("Malformed JWT: expected 3 dot-separated parts");
	}
	const decoded = Buffer.from(payloadSegment, "base64url").toString("utf-8");
	return JSON.parse(decoded) as JwtPayload;
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.decorate(
		"authenticate",
		async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
			try {
				const authHeader = request.headers.authorization;
				if (!authHeader?.startsWith("Bearer ")) {
					reply.status(401).send({ message: "Unauthorized" });
					return;
				}
				request.user = decodeJwtPayload(authHeader.slice(7));
			} catch {
				reply.status(401).send({ message: "Unauthorized" });
			}
		},
	);
};

export default fp(authPlugin, {
	name: "auth",
	fastify: "5.x",
});
