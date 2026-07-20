import {
	createVitalSignHandler,
	deleteVitalSignHandler,
	getVitalSignHandler,
	listVitalSignsHandler,
	updateVitalSignHandler,
} from "@/modules/vital-signs/vital-signs.controller.js";
import {
	CreateVitalSignBody,
	ListVitalSignsQuerystring,
	PaginatedVitalSignsResponse,
	UpdateVitalSignBody,
	VitalSignIdParam,
	VitalSignPatientParam,
	VitalSignResponse,
} from "@/modules/vital-signs/vital-signs.schema.js";
import type { FastifyPluginAsync } from "fastify";

const vitalSignsRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get<{ Params: VitalSignPatientParam; Querystring: ListVitalSignsQuerystring }>(
		"/",
		{
			schema: {
				summary: "List vital signs",
				description:
					"Returns a paginated list of vital sign records for a patient, ordered by recorded time.",
				tags: ["vital-signs"],
				params: VitalSignPatientParam,
				querystring: ListVitalSignsQuerystring,
				response: { 200: PaginatedVitalSignsResponse },
			},
			onRequest: [fastify.authenticate],
		},
		listVitalSignsHandler,
	);

	fastify.get<{ Params: VitalSignIdParam }>(
		"/:id",
		{
			schema: {
				summary: "Get vital sign record",
				description: "Returns a single vital sign record by ID.",
				tags: ["vital-signs"],
				params: VitalSignIdParam,
				response: { 200: VitalSignResponse },
			},
			onRequest: [fastify.authenticate],
		},
		getVitalSignHandler,
	);

	fastify.post<{ Params: VitalSignPatientParam; Body: CreateVitalSignBody }>(
		"/",
		{
			schema: {
				summary: "Record vital signs",
				description:
					"Records a new set of vital signs for a patient. All measurement fields are optional — only supply what was observed.",
				tags: ["vital-signs"],
				params: VitalSignPatientParam,
				body: CreateVitalSignBody,
				response: { 201: VitalSignResponse },
			},
			onRequest: [fastify.authenticate],
		},
		createVitalSignHandler,
	);

	fastify.patch<{ Params: VitalSignIdParam; Body: UpdateVitalSignBody }>(
		"/:id",
		{
			schema: {
				summary: "Update vital sign record",
				description: "Partially updates an existing vital sign record.",
				tags: ["vital-signs"],
				params: VitalSignIdParam,
				body: UpdateVitalSignBody,
				response: { 200: VitalSignResponse },
			},
			onRequest: [fastify.authenticate],
		},
		updateVitalSignHandler,
	);

	fastify.delete<{ Params: VitalSignIdParam }>(
		"/:id",
		{
			schema: {
				summary: "Delete vital sign record",
				description: "Permanently deletes a vital sign record.",
				tags: ["vital-signs"],
				params: VitalSignIdParam,
				response: { 204: {} },
			},
			onRequest: [fastify.authenticate],
		},
		deleteVitalSignHandler,
	);
};

export default vitalSignsRoutes;
