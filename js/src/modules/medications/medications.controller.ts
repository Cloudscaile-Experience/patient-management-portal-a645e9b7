import type {
	CreateMedicationBody,
	ListMedicationsQuerystring,
	MedicationIdParam,
	MedicationPatientParam,
	UpdateMedicationBody,
} from "@/modules/medications/medications.schema.js";
import {
	MedicationNotFoundError,
	PatientNotFoundError,
	createMedication,
	deleteMedication,
	getMedicationById,
	listMedications,
	updateMedication,
} from "@/modules/medications/medications.service.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function listMedicationsHandler(
	request: FastifyRequest<{
		Params: MedicationPatientParam;
		Querystring: ListMedicationsQuerystring;
	}>,
	reply: FastifyReply,
): Promise<void> {
	try {
		const result = await listMedications(
			request.server.db,
			request.params.patientId,
			request.query,
		);
		reply.send(result);
	} catch (err) {
		if (err instanceof PatientNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}

export async function getMedicationHandler(
	request: FastifyRequest<{ Params: MedicationIdParam }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		const record = await getMedicationById(
			request.server.db,
			request.params.patientId,
			request.params.id,
		);
		reply.send(record);
	} catch (err) {
		if (err instanceof MedicationNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}

export async function createMedicationHandler(
	request: FastifyRequest<{ Params: MedicationPatientParam; Body: CreateMedicationBody }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		const record = await createMedication(
			request.server.db,
			request.params.patientId,
			request.body,
		);
		reply.status(201).send(record);
	} catch (err) {
		if (err instanceof PatientNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}

export async function updateMedicationHandler(
	request: FastifyRequest<{ Params: MedicationIdParam; Body: UpdateMedicationBody }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		const record = await updateMedication(
			request.server.db,
			request.params.patientId,
			request.params.id,
			request.body,
		);
		reply.send(record);
	} catch (err) {
		if (err instanceof MedicationNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}

export async function deleteMedicationHandler(
	request: FastifyRequest<{ Params: MedicationIdParam }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		await deleteMedication(request.server.db, request.params.patientId, request.params.id);
		reply.status(204).send();
	} catch (err) {
		if (err instanceof MedicationNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}
