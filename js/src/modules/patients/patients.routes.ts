import {
	createPatientHandler,
	deletePatientHandler,
	getPatientHandler,
	listPatientsHandler,
	updatePatientHandler,
} from "@/modules/patients/patients.controller.js";
import {
	CreatePatientBody,
	ListPatientsQuerystring,
	PaginatedPatientsResponse,
	PatientIdParam,
	PatientResponse,
	UpdatePatientBody,
} from "@/modules/patients/patients.schema.js";
import type { FastifyPluginAsync } from "fastify";

const patientsRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get<{ Querystring: ListPatientsQuerystring }>(
		"/",
		{
			schema: {
				summary: "List patients",
				description: "Returns a paginated list of patients. Supports search by name or email.",
				tags: ["patients"],
				querystring: ListPatientsQuerystring,
				response: { 200: PaginatedPatientsResponse },
			},
			onRequest: [fastify.authenticate],
		},
		listPatientsHandler,
	);

	fastify.get<{ Params: PatientIdParam }>(
		"/:id",
		{
			schema: {
				summary: "Get patient by ID",
				description: "Returns a single patient record by UUID.",
				tags: ["patients"],
				params: PatientIdParam,
				response: { 200: PatientResponse },
			},
			onRequest: [fastify.authenticate],
		},
		getPatientHandler,
	);

	fastify.post<{ Body: CreatePatientBody }>(
		"/",
		{
			schema: {
				summary: "Create patient",
				description: "Creates a new patient record.",
				tags: ["patients"],
				body: CreatePatientBody,
				response: { 201: PatientResponse },
			},
			onRequest: [fastify.authenticate],
		},
		createPatientHandler,
	);

	fastify.patch<{ Params: PatientIdParam; Body: UpdatePatientBody }>(
		"/:id",
		{
			schema: {
				summary: "Update patient",
				description: "Partially updates an existing patient record.",
				tags: ["patients"],
				params: PatientIdParam,
				body: UpdatePatientBody,
				response: { 200: PatientResponse },
			},
			onRequest: [fastify.authenticate],
		},
		updatePatientHandler,
	);

	fastify.delete<{ Params: PatientIdParam }>(
		"/:id",
		{
			schema: {
				summary: "Delete patient",
				description: "Permanently deletes a patient record.",
				tags: ["patients"],
				params: PatientIdParam,
				response: { 204: {} },
			},
			onRequest: [fastify.authenticate],
		},
		deletePatientHandler,
	);
};

export default patientsRoutes;
