import { buildApp } from "@/app.js";
import * as medicationsService from "@/modules/medications/medications.service.js";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/medications/medications.service.js");

const PATIENT_ID = "123e4567-e89b-12d3-a456-426614174000";
const MED_ID = "323e4567-e89b-12d3-a456-426614174002";

const mockMedication = {
	id: MED_ID,
	patientId: PATIENT_ID,
	name: "Lisinopril",
	genericName: "Lisinopril",
	dosage: "10 mg",
	route: "oral" as const,
	frequency: "once daily",
	startDate: "2024-01-01",
	endDate: null,
	prescriber: "Dr. Smith",
	status: "active" as const,
	notes: "For hypertension management",
	createdAt: "2024-01-01T00:00:00.000Z",
	updatedAt: "2024-01-01T00:00:00.000Z",
};

const mockPaginatedResponse = {
	data: [mockMedication],
	total: 1,
	page: 1,
	pageSize: 20,
};

describe("Medications routes", () => {
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

	describe("GET /v1/patients/:patientId/medications", () => {
		it("should return paginated medications list", async () => {
			vi.mocked(medicationsService.listMedications).mockResolvedValue(mockPaginatedResponse);

			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${PATIENT_ID}/medications`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(200);
			const body = response.json();
			expect(body.data).toHaveLength(1);
			expect(body.data[0]).toMatchObject({ name: "Lisinopril", status: "active" });
			expect(body.total).toBe(1);
		});

		it("should filter by status", async () => {
			vi.mocked(medicationsService.listMedications).mockResolvedValue(mockPaginatedResponse);

			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${PATIENT_ID}/medications?status=active`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(200);
			expect(medicationsService.listMedications).toHaveBeenCalledWith(
				expect.anything(),
				PATIENT_ID,
				expect.objectContaining({ status: "active" }),
			);
		});

		it("should return 404 when patient does not exist", async () => {
			vi.mocked(medicationsService.listMedications).mockRejectedValue(
				new medicationsService.PatientNotFoundError(PATIENT_ID),
			);

			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${PATIENT_ID}/medications`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(404);
		});

		it("should return 401 when no auth token is provided", async () => {
			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${PATIENT_ID}/medications`,
			});

			expect(response.statusCode).toBe(401);
		});
	});

	describe("GET /v1/patients/:patientId/medications/:id", () => {
		it("should return a medication by id", async () => {
			vi.mocked(medicationsService.getMedicationById).mockResolvedValue(mockMedication);

			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${PATIENT_ID}/medications/${MED_ID}`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(200);
			expect(response.json()).toMatchObject({ id: MED_ID, name: "Lisinopril" });
		});

		it("should return 404 when medication does not exist", async () => {
			vi.mocked(medicationsService.getMedicationById).mockRejectedValue(
				new medicationsService.MedicationNotFoundError(MED_ID),
			);

			const response = await app.inject({
				method: "GET",
				url: `/v1/patients/${PATIENT_ID}/medications/${MED_ID}`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(404);
		});
	});

	describe("POST /v1/patients/:patientId/medications", () => {
		it("should create a medication and return 201", async () => {
			vi.mocked(medicationsService.createMedication).mockResolvedValue(mockMedication);

			const response = await app.inject({
				method: "POST",
				url: `/v1/patients/${PATIENT_ID}/medications`,
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					name: "Lisinopril",
					dosage: "10 mg",
					route: "oral",
					frequency: "once daily",
					startDate: "2024-01-01",
				}),
			});

			expect(response.statusCode).toBe(201);
			expect(response.json()).toMatchObject({ name: "Lisinopril" });
		});

		it("should return 400 when required fields are missing", async () => {
			const response = await app.inject({
				method: "POST",
				url: `/v1/patients/${PATIENT_ID}/medications`,
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({ name: "Lisinopril" }),
			});

			expect(response.statusCode).toBe(400);
		});

		it("should return 404 when patient does not exist", async () => {
			vi.mocked(medicationsService.createMedication).mockRejectedValue(
				new medicationsService.PatientNotFoundError(PATIENT_ID),
			);

			const response = await app.inject({
				method: "POST",
				url: `/v1/patients/${PATIENT_ID}/medications`,
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({
					name: "Lisinopril",
					dosage: "10 mg",
					route: "oral",
					frequency: "once daily",
					startDate: "2024-01-01",
				}),
			});

			expect(response.statusCode).toBe(404);
		});
	});

	describe("PATCH /v1/patients/:patientId/medications/:id", () => {
		it("should update a medication and return updated record", async () => {
			const updated = { ...mockMedication, status: "discontinued" as const };
			vi.mocked(medicationsService.updateMedication).mockResolvedValue(updated);

			const response = await app.inject({
				method: "PATCH",
				url: `/v1/patients/${PATIENT_ID}/medications/${MED_ID}`,
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({ status: "discontinued" }),
			});

			expect(response.statusCode).toBe(200);
			expect(response.json()).toMatchObject({ status: "discontinued" });
		});

		it("should return 404 when medication does not exist", async () => {
			vi.mocked(medicationsService.updateMedication).mockRejectedValue(
				new medicationsService.MedicationNotFoundError(MED_ID),
			);

			const response = await app.inject({
				method: "PATCH",
				url: `/v1/patients/${PATIENT_ID}/medications/${MED_ID}`,
				headers: {
					authorization: `Bearer ${authToken}`,
					"content-type": "application/json",
				},
				body: JSON.stringify({ status: "discontinued" }),
			});

			expect(response.statusCode).toBe(404);
		});
	});

	describe("DELETE /v1/patients/:patientId/medications/:id", () => {
		it("should delete a medication and return 204", async () => {
			vi.mocked(medicationsService.deleteMedication).mockResolvedValue(undefined);

			const response = await app.inject({
				method: "DELETE",
				url: `/v1/patients/${PATIENT_ID}/medications/${MED_ID}`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(204);
		});

		it("should return 404 when medication does not exist", async () => {
			vi.mocked(medicationsService.deleteMedication).mockRejectedValue(
				new medicationsService.MedicationNotFoundError(MED_ID),
			);

			const response = await app.inject({
				method: "DELETE",
				url: `/v1/patients/${PATIENT_ID}/medications/${MED_ID}`,
				headers: { authorization: `Bearer ${authToken}` },
			});

			expect(response.statusCode).toBe(404);
		});
	});
});
