import type { Db } from "@/db/index.js";
import { patients } from "@/db/schema/index.js";
import type {
	CreatePatientBody,
	ListPatientsQuerystring,
	PaginatedPatientsResponse,
	PatientResponse,
	UpdatePatientBody,
} from "@/modules/patients/patients.schema.js";
import { count, eq, ilike, or } from "drizzle-orm";

export class PatientNotFoundError extends Error {
	constructor(id: string) {
		super(`Patient with id '${id}' not found`);
		this.name = "PatientNotFoundError";
	}
}

export class PatientEmailConflictError extends Error {
	constructor(email: string) {
		super(`A patient with email '${email}' already exists`);
		this.name = "PatientEmailConflictError";
	}
}

export async function listPatients(
	db: Db,
	query: ListPatientsQuerystring,
): Promise<PaginatedPatientsResponse> {
	const page = query.page ?? 1;
	const pageSize = query.pageSize ?? 20;
	const offset = (page - 1) * pageSize;

	const whereClause = query.search
		? or(ilike(patients.name, `%${query.search}%`), ilike(patients.email, `%${query.search}%`))
		: undefined;

	const [rows, [totalResult]] = await Promise.all([
		db.select().from(patients).where(whereClause).limit(pageSize).offset(offset),
		db.select({ value: count() }).from(patients).where(whereClause),
	]);

	return {
		data: rows.map(toPatientResponse),
		total: totalResult?.value ?? 0,
		page,
		pageSize,
	};
}

export async function getPatientById(db: Db, id: string): Promise<PatientResponse> {
	const [patient] = await db.select().from(patients).where(eq(patients.id, id)).limit(1);

	if (!patient) {
		throw new PatientNotFoundError(id);
	}

	return toPatientResponse(patient);
}

export async function createPatient(db: Db, data: CreatePatientBody): Promise<PatientResponse> {
	const [created] = await db.insert(patients).values(data).returning();

	if (!created) {
		throw new Error("Failed to create patient");
	}

	return toPatientResponse(created);
}

export async function updatePatient(
	db: Db,
	id: string,
	data: UpdatePatientBody,
): Promise<PatientResponse> {
	const [updated] = await db
		.update(patients)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(patients.id, id))
		.returning();

	if (!updated) {
		throw new PatientNotFoundError(id);
	}

	return toPatientResponse(updated);
}

export async function deletePatient(db: Db, id: string): Promise<void> {
	const [deleted] = await db
		.delete(patients)
		.where(eq(patients.id, id))
		.returning({ id: patients.id });

	if (!deleted) {
		throw new PatientNotFoundError(id);
	}
}

function toPatientResponse(patient: typeof patients.$inferSelect): PatientResponse {
	return {
		id: patient.id,
		name: patient.name,
		dateOfBirth: patient.dateOfBirth,
		email: patient.email,
		phone: patient.phone ?? null,
		gender: patient.gender ?? null,
		address: patient.address ?? null,
		createdAt: patient.createdAt.toISOString(),
		updatedAt: patient.updatedAt.toISOString(),
	};
}
