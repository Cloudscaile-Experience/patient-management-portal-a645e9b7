import type { Db } from "@/db/index.js";
import { medications, patients } from "@/db/schema/index.js";
import type {
	CreateMedicationBody,
	ListMedicationsQuerystring,
	MedicationResponse,
	PaginatedMedicationsResponse,
	UpdateMedicationBody,
} from "@/modules/medications/medications.schema.js";
import { and, count, eq } from "drizzle-orm";

export class MedicationNotFoundError extends Error {
	constructor(id: string) {
		super(`Medication with id '${id}' not found`);
		this.name = "MedicationNotFoundError";
	}
}

export class PatientNotFoundError extends Error {
	constructor(id: string) {
		super(`Patient with id '${id}' not found`);
		this.name = "PatientNotFoundError";
	}
}

async function assertPatientExists(db: Db, patientId: string): Promise<void> {
	const [row] = await db
		.select({ id: patients.id })
		.from(patients)
		.where(eq(patients.id, patientId))
		.limit(1);
	if (!row) {
		throw new PatientNotFoundError(patientId);
	}
}

export async function listMedications(
	db: Db,
	patientId: string,
	query: ListMedicationsQuerystring,
): Promise<PaginatedMedicationsResponse> {
	await assertPatientExists(db, patientId);

	const page = query.page ?? 1;
	const pageSize = query.pageSize ?? 20;
	const offset = (page - 1) * pageSize;

	const conditions = [eq(medications.patientId, patientId)];
	if (query.status) {
		conditions.push(eq(medications.status, query.status));
	}

	const whereClause = and(...conditions);

	const [rows, [totalResult]] = await Promise.all([
		db
			.select()
			.from(medications)
			.where(whereClause)
			.orderBy(medications.startDate)
			.limit(pageSize)
			.offset(offset),
		db.select({ value: count() }).from(medications).where(whereClause),
	]);

	return {
		data: rows.map(toMedicationResponse),
		total: totalResult?.value ?? 0,
		page,
		pageSize,
	};
}

export async function getMedicationById(
	db: Db,
	patientId: string,
	id: string,
): Promise<MedicationResponse> {
	const [row] = await db
		.select()
		.from(medications)
		.where(and(eq(medications.id, id), eq(medications.patientId, patientId)))
		.limit(1);

	if (!row) {
		throw new MedicationNotFoundError(id);
	}

	return toMedicationResponse(row);
}

export async function createMedication(
	db: Db,
	patientId: string,
	data: CreateMedicationBody,
): Promise<MedicationResponse> {
	await assertPatientExists(db, patientId);

	const [created] = await db
		.insert(medications)
		.values({ ...data, patientId })
		.returning();

	if (!created) {
		throw new Error("Failed to create medication record");
	}

	return toMedicationResponse(created);
}

export async function updateMedication(
	db: Db,
	patientId: string,
	id: string,
	data: UpdateMedicationBody,
): Promise<MedicationResponse> {
	const [updated] = await db
		.update(medications)
		.set({ ...data, updatedAt: new Date() })
		.where(and(eq(medications.id, id), eq(medications.patientId, patientId)))
		.returning();

	if (!updated) {
		throw new MedicationNotFoundError(id);
	}

	return toMedicationResponse(updated);
}

export async function deleteMedication(db: Db, patientId: string, id: string): Promise<void> {
	const [deleted] = await db
		.delete(medications)
		.where(and(eq(medications.id, id), eq(medications.patientId, patientId)))
		.returning({ id: medications.id });

	if (!deleted) {
		throw new MedicationNotFoundError(id);
	}
}

function toMedicationResponse(row: typeof medications.$inferSelect): MedicationResponse {
	return {
		id: row.id,
		patientId: row.patientId,
		name: row.name,
		genericName: row.genericName ?? null,
		dosage: row.dosage,
		route: row.route,
		frequency: row.frequency,
		startDate: row.startDate,
		endDate: row.endDate ?? null,
		prescriber: row.prescriber ?? null,
		status: row.status,
		notes: row.notes ?? null,
		createdAt: row.createdAt.toISOString(),
		updatedAt: row.updatedAt.toISOString(),
	};
}
