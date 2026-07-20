import type {
	CreatePatientBody,
	ListPatientsQuerystring,
	PatientIdParam,
	UpdatePatientBody,
} from "@/modules/patients/patients.schema.js";
import {
	PatientEmailConflictError,
	PatientNotFoundError,
	createPatient,
	deletePatient,
	getPatientById,
	listPatients,
	updatePatient,
} from "@/modules/patients/patients.service.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function listPatientsHandler(
	request: FastifyRequest<{ Querystring: ListPatientsQuerystring }>,
	reply: FastifyReply,
): Promise<void> {
	const result = await listPatients(request.server.db, request.query);
	reply.send(result);
}

export async function getPatientHandler(
	request: FastifyRequest<{ Params: PatientIdParam }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		const patient = await getPatientById(request.server.db, request.params.id);
		reply.send(patient);
	} catch (err) {
		if (err instanceof PatientNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}

export async function createPatientHandler(
	request: FastifyRequest<{ Body: CreatePatientBody }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		const patient = await createPatient(request.server.db, request.body);
		reply.status(201).send(patient);
	} catch (err) {
		if (err instanceof PatientEmailConflictError) {
			reply.status(409).send({ message: err.message });
			return;
		}
		throw err;
	}
}

export async function updatePatientHandler(
	request: FastifyRequest<{ Params: PatientIdParam; Body: UpdatePatientBody }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		const patient = await updatePatient(request.server.db, request.params.id, request.body);
		reply.send(patient);
	} catch (err) {
		if (err instanceof PatientNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}

export async function deletePatientHandler(
	request: FastifyRequest<{ Params: PatientIdParam }>,
	reply: FastifyReply,
): Promise<void> {
	try {
		await deletePatient(request.server.db, request.params.id);
		reply.status(204).send();
	} catch (err) {
		if (err instanceof PatientNotFoundError) {
			reply.status(404).send({ message: err.message });
			return;
		}
		throw err;
	}
}
