import { buildApp } from "@/app.js";
import * as patientsService from "@/modules/patients/patients.service.js";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/patients/patients.service.js");

const mockPatient = {
	id: "123e4567-e89b-12d3-a456-426614174000",
	name: "Jane Doe",
	dateOfBirth: "1990-05-15",
	email: "jane.doe@example.com",
	phone: "+1234567890",
	gender: "female",
	address: "123 Main St",
	createdAt: "2024-01-01T00:00:00.000Z",
	updatedAt: "2024-01-01T00:00:00.000Z",
};

const mockPaginatedResponse = {
	data: [mockPatient],
	total: 1,
	page: 1,
	pageSize: 20,
};

describe("Patients routes", () => {
	let app: FastifyInstance;
	let authToken: string;

	beforeAll(async () => {
		app = await buildApp();
		await app.ready();
		// Build a JWT-shaped token without a signature — the service only decodes, never verifies.
		const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
		const payload = Buffer.from(JSON.stringify({ sub: "user-123", role: "admin" })).toString(
			"base64url",
		);
		authToken = `${header}.${payload}.`;
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("GET /v1/patients", () => {
		it("should return paginated patients list", async () => {
			vi.mocked(patientsService.listPatients).mockResolvedValue(mockPaginatedResponse);

			const response = await app.inject({
				method: "GET",
				url: "/v1/patients",
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(200);
			const body = response.json();
			expect(body).toMatchObject({
				data: expect.arrayContaining([expect.objectContaining({ name: "Jane Doe" })]),
				total: 1,
				page: 1,
			});
		});

		it("should return 401 when no auth token is provided", async () => {
			const response = await app.inject({
				method: "GET",
				url: "/v1/patients",
			});

			expect(response.statusCode).toBe(401);
		});
	});

	describe("GET /v1/patients/:id", () => {
		it("should return a patient by id", async () => {
			vi.mocked(patientsService.getPatientById).mockResolvedValue(mockPatient);

			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${mockPatient.id}`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(200);
			expect(response.json()).toMatchObject({ id: mockPatient.id, name: "Jane Doe" });
		});

		it("should return 404 when patient does not exist", async () => {
			vi.mocked(patientsService.getPatientById).mockRejectedValue(
				new patientsService.PatientNotFoundError("nonexistent-id"),
			);

			const response = await app.inject({
				method: "GET",
				url: "/v1/patients/123e4567-e89b-12d3-a456-426614174999",
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(404);
		});
	});

	describe("POST /v1/patients", () => {
		it("should create a new patient and return 201", async () => {
			vi.mocked(patientsService.createPatient).mockResolvedValue(mockPatient);

			const response = await app.inject({
				method: "POST",
				url: "/v1/patients",
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					name: "Jane Doe",
					dateOfBirth: "1990-05-15",
					email: "jane.doe@example.com",
				}),
			});

			expect(response.statusCode).toBe(201);
			expect(response.json()).toMatchObject({ name: "Jane Doe" });
		});

		it("should return 400 when required fields are missing", async () => {
			const response = await app.inject({
				method: "POST",
				url: "/v1/patients",
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({ name: "Jane Doe" }),
			});

			expect(response.statusCode).toBe(400);
		});
	});

	describe("PATCH /v1/patients/:id", () => {
		it("should update a patient and return updated record", async () => {
			const updated = { ...mockPatient, name: "Jane Smith" };
			vi.mocked(patientsService.updatePatient).mockResolvedValue(updated);

			const response = await app.inject({
				method: "PATCH",
				url: `/v1/patients/${mockPatient.id}`,
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({ name: "Jane Smith" }),
			});

			expect(response.statusCode).toBe(200);
			expect(response.json()).toMatchObject({ name: "Jane Smith" });
		});
	});

	describe("DELETE /v1/patients/:id", () => {
		it("should delete a patient and return 204", async () => {
			vi.mocked(patientsService.deletePatient).mockResolvedValue(undefined);

			const response = await app.inject({
				method: "DELETE",
				url: `/v1/patients/${mockPatient.id}`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(204);
		});

		it("should return 404 when patient does not exist", async () => {
			vi.mocked(patientsService.deletePatient).mockRejectedValue(
				new patientsService.PatientNotFoundError("nonexistent-id"),
			);

			const response = await app.inject({
				method: "DELETE",
				url: "/v1/patients/123e4567-e89b-12d3-a456-426614174999",
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(404);
		});
	});
});
