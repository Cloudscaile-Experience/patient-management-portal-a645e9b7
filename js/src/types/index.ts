import type { Db } from "@/db/index.js";

export interface JwtPayload {
	sub?: string;
	id?: string;
	role?: string;
	email?: string;
	[key: string]: unknown;
}

declare module "fastify" {
	interface FastifyInstance {
		db: Db;
		authenticate: (
			request: import("fastify").FastifyRequest,
			reply: import("fastify").FastifyReply,
		) => Promise<void>;
	}

	interface FastifyRequest {
		user: JwtPayload;
	}
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
}

export interface ApiError {
	statusCode: number;
	error: string;
	message: string;
}
