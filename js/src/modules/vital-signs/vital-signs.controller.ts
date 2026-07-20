import type {
	CreateVitalSignBody,
	ListVitalSignsQuerystring,
	UpdateVitalSignBody,
	VitalSignIdParam,
	VitalSignPatientParam,
} from "@/modules/vital-signs/vital-signs.schema.js";
import {
	PatientNotFoundError,
	VitalSignNotFoundError,
	createVitalSign,
	deleteVitalSign,
	getVitalSignById,
	listVitalSigns,
	updateVitalSign,
} from "@/modules/vital-signs/vital-signs.service.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function listVitalSignsHandler(
	request: FastifyRequest<{
		Params: VitalSignPatientParam;
		Querystring: ListVitalSignsQuerystring;
	}>,
	reply: FastifyReply,
): Promise<void> {
	try {
		const result = await listVitalSigns(request.server.db, request.params.patientId, request.query);
		reply.send(result);
	} catch (err) {
		if (err instanceof PatientNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}

export async function getVitalSignHandler(
	request: FastifyRequest<{ Params: VitalSignIdParam }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		const record = await getVitalSignById(
			request.server.db,
			request.params.patientId,
			request.params.id,
		);
		reply.send(record);
	} catch (err) {
		if (err instanceof VitalSignNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}

export async function createVitalSignHandler(
	request: FastifyRequest<{ Params: VitalSignPatientParam; Body: CreateVitalSignBody }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		const record = await createVitalSign(request.server.db, request.params.patientId, request.body);
		reply.status(201).send(record);
	} catch (err) {
		if (err instanceof PatientNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}

export async function updateVitalSignHandler(
	request: FastifyRequest<{ Params: VitalSignIdParam; Body: UpdateVitalSignBody }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		const record = await updateVitalSign(
			request.server.db,
			request.params.patientId,
			request.params.id,
			request.body,
		);
		reply.send(record);
	} catch (err) {
		if (err instanceof VitalSignNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}

export async function deleteVitalSignHandler(
	request: FastifyRequest<{ Params: VitalSignIdParam }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		await deleteVitalSign(request.server.db, request.params.patientId, request.params.id);
		reply.status(204).send();
	} catch (err) {
		if (err instanceof VitalSignNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}
