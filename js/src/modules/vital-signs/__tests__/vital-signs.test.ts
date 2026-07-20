import { buildApp } from "@/app.js";
import * as vitalSignsService from "@/modules/vital-signs/vital-signs.service.js";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/vital-signs/vital-signs.service.js");

const PATIENT_ID = "123e4567-e89b-12d3-a456-426614174000";
const VITAL_ID = "223e4567-e89b-12d3-a456-426614174001";

const mockVital = {
	id: VITAL_ID,
	patientId: PATIENT_ID,
	recordedAt: "2024-06-01T08:00:00.000Z",
	heartRate: 72,
	respiratoryRate: 16,
	spo2: 98.5,
	systolicBp: 120,
	diastolicBp: 80,
	temperature: 36.8,
	weight: 72.5,
	height: 175.0,
	painScore: 2,
	recordedBy: "Nurse A",
	notes: "Routine morning check",
	createdAt: "2024-06-01T08:00:00.000Z",
	updatedAt: "2024-06-01T08:00:00.000Z",
};

const mockPaginatedResponse = {
	data: [mockVital],
	total: 1,
	page: 1,
	pageSize: 20,
};

describe("Vital signs routes", () => {
	let app: FastifyInstance;
	let authToken: string;

	beforeAll(async () => {
		app = await buildApp();
		await app.ready();
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

	describe("GET /v1/patients/:patientId/vitals", () => {
		it("should return paginated vital signs list", async () => {
			vi.mocked(vitalSignsService.listVitalSigns).mockResolvedValue(mockPaginatedResponse);

			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${PATIENT_ID}/vitals`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(200);
			const body = response.json();
			expect(body.data).toHaveLength(1);
			expect(body.data[0]).toMatchObject({ heartRate: 72, spo2: 98.5 });
			expect(body.total).toBe(1);
		});

		it("should return 404 when patient does not exist", async () => {
			vi.mocked(vitalSignsService.listVitalSigns).mockRejectedValue(
				new vitalSignsService.PatientNotFoundError(PATIENT_ID),
			);

			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${PATIENT_ID}/vitals`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(404);
		});

		it("should return 401 when no auth token is provided", async () => {
			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${PATIENT_ID}/vitals`,
			});

			expect(response.statusCode).toBe(401);
		});
	});

	describe("GET /v1/patients/:patientId/vitals/:id", () => {
		it("should return a vital sign record by id", async () => {
			vi.mocked(vitalSignsService.getVitalSignById).mockResolvedValue(mockVital);

			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${PATIENT_ID}/vitals/${VITAL_ID}`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(200);
			expect(response.json()).toMatchObject({ id: VITAL_ID, heartRate: 72 });
		});

		it("should return 404 when vital sign record does not exist", async () => {
			vi.mocked(vitalSignsService.getVitalSignById).mockRejectedValue(
				new vitalSignsService.VitalSignNotFoundError(VITAL_ID),
			);

			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${PATIENT_ID}/vitals/${VITAL_ID}`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(404);
		});
	});

	describe("POST /v1/patients/:patientId/vitals", () => {
		it("should create a vital sign record and return 201", async () => {
			vi.mocked(vitalSignsService.createVitalSign).mockResolvedValue(mockVital);

			const response = await app.inject({
				method: "POST",
				url: `/v1/patients/${PATIENT_ID}/vitals`,
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					recordedAt: "2024-06-01T08:00:00.000Z",
					heartRate: 72,
					spo2: 98.5,
				}),
			});

			expect(response.statusCode).toBe(201);
			expect(response.json()).toMatchObject({ heartRate: 72 });
		});

		it("should return 400 when recordedAt is missing", async () => {
			const response = await app.inject({
				method: "POST",
				url: `/v1/patients/${PATIENT_ID}/vitals`,
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({ heartRate: 72 }),
			});

			expect(response.statusCode).toBe(400);
		});

		it("should return 404 when patient does not exist", async () => {
			vi.mocked(vitalSignsService.createVitalSign).mockRejectedValue(
				new vitalSignsService.PatientNotFoundError(PATIENT_ID),
			);

			const response = await app.inject({
				method: "POST",
				url: `/v1/patients/${PATIENT_ID}/vitals`,
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({ recordedAt: "2024-06-01T08:00:00.000Z" }),
			});

			expect(response.statusCode).toBe(404);
		});
	});

	describe("PATCH /v1/patients/:patientId/vitals/:id", () => {
		it("should update a vital sign record", async () => {
			const updated = { ...mockVital, heartRate: 80 };
			vi.mocked(vitalSignsService.updateVitalSign).mockResolvedValue(updated);

			const response = await app.inject({
				method: "PATCH",
				url: `/v1/patients/${PATIENT_ID}/vitals/${VITAL_ID}`,
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({ heartRate: 80 }),
			});

			expect(response.statusCode).toBe(200);
			expect(response.json()).toMatchObject({ heartRate: 80 });
		});

		it("should return 404 when record does not exist", async () => {
			vi.mocked(vitalSignsService.updateVitalSign).mockRejectedValue(
				new vitalSignsService.VitalSignNotFoundError(VITAL_ID),
			);

			const response = await app.inject({
				method: "PATCH",
				url: `/v1/patients/${PATIENT_ID}/vitals/${VITAL_ID}`,
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({ heartRate: 80 }),
			});

			expect(response.statusCode).toBe(404);
		});
	});

	describe("DELETE /v1/patients/:patientId/vitals/:id", () => {
		it("should delete a vital sign record and return 204", async () => {
			vi.mocked(vitalSignsService.deleteVitalSign).mockResolvedValue(undefined);

			const response = await app.inject({
				method: "DELETE",
				url: `/v1/patients/${PATIENT_ID}/vitals/${VITAL_ID}`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(204);
		});

		it("should return 404 when record does not exist", async () => {
			vi.mocked(vitalSignsService.deleteVitalSign).mockRejectedValue(
				new vitalSignsService.VitalSignNotFoundError(VITAL_ID),
			);

			const response = await app.inject({
				method: "DELETE",
				url: `/v1/patients/${PATIENT_ID}/vitals/${VITAL_ID}`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(404);
		});
	});
});
