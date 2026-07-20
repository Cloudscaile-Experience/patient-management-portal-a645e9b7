import {
	createMedicationHandler,
	deleteMedicationHandler,
	getMedicationHandler,
	listMedicationsHandler,
	updateMedicationHandler,
} from "@/modules/medications/medications.controller.js";
import {
	CreateMedicationBody,
	ListMedicationsQuerystring,
	MedicationIdParam,
	MedicationPatientParam,
	MedicationResponse,
	PaginatedMedicationsResponse,
	UpdateMedicationBody,
} from "@/modules/medications/medications.schema.js";
import type { FastifyPluginAsync } from "fastify";

const medicationsRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get<{ Params: MedicationPatientParam; Querystring: ListMedicationsQuerystring }>(
		"/",
		{
			schema: {
				summary: "List medications",
				description:
					"Returns a paginated list of medications for a patient. Optionally filter by status.",
				tags: ["medications"],
				params: MedicationPatientParam,
				querystring: ListMedicationsQuerystring,
				response: { 200: PaginatedMedicationsResponse },
			},
			onRequest: [fastify.authenticate],
		},
		listMedicationsHandler,
	);

	fastify.get<{ Params: MedicationIdParam }>(
		"/:id",
		{
			schema: {
				summary: "Get medication",
				description: "Returns a single medication record by ID.",
				tags: ["medications"],
				params: MedicationIdParam,
				response: { 200: MedicationResponse },
			},
			onRequest: [fastify.authenticate],
		},
		getMedicationHandler,
	);

	fastify.post<{ Params: MedicationPatientParam; Body: CreateMedicationBody }>(
		"/",
		{
			schema: {
				summary: "Add medication",
				description: "Adds a new medication to a patient's record.",
				tags: ["medications"],
				params: MedicationPatientParam,
				body: CreateMedicationBody,
				response: { 201: MedicationResponse },
			},
			onRequest: [fastify.authenticate],
		},
		createMedicationHandler,
	);

	fastify.patch<{ Params: MedicationIdParam; Body: UpdateMedicationBody }>(
		"/:id",
		{
			schema: {
				summary: "Update medication",
				description: "Partially updates a medication record (e.g., change status, adjust dosage).",
				tags: ["medications"],
				params: MedicationIdParam,
				body: UpdateMedicationBody,
				response: { 200: MedicationResponse },
			},
			onRequest: [fastify.authenticate],
		},
		updateMedicationHandler,
	);

	fastify.delete<{ Params: MedicationIdParam }>(
		"/:id",
		{
			schema: {
				summary: "Delete medication",
				description: "Permanently deletes a medication record.",
				tags: ["medications"],
				params: MedicationIdParam,
				response: { 204: {} },
			},
			onRequest: [fastify.authenticate],
		},
		deleteMedicationHandler,
	);
};

export default medicationsRoutes;
