import type { Db } from "@/db/index.js";
import { patients, vitalSigns } from "@/db/schema/index.js";
import type {
	CreateVitalSignBody,
	ListVitalSignsQuerystring,
	PaginatedVitalSignsResponse,
	UpdateVitalSignBody,
	VitalSignResponse,
} from "@/modules/vital-signs/vital-signs.schema.js";
import { and, count, eq, gte, lte } from "drizzle-orm";

export class VitalSignNotFoundError extends Error {
	constructor(id: string) {
		super(`Vital sign record with id '${id}' not found`);
		this.name = "VitalSignNotFoundError";
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

export async function listVitalSigns(
	db: Db,
	patientId: string,
	query: ListVitalSignsQuerystring,
): Promise<PaginatedVitalSignsResponse> {
	await assertPatientExists(db, patientId);

	const page = query.page ?? 1;
	const pageSize = query.pageSize ?? 20;
	const offset = (page - 1) * pageSize;

	const conditions = [eq(vitalSigns.patientId, patientId)];
	if (query.from) {
		conditions.push(gte(vitalSigns.recordedAt, new Date(query.from)));
	}
	if (query.to) {
		conditions.push(lte(vitalSigns.recordedAt, new Date(query.to)));
	}

	const whereClause = and(...conditions);

	const [rows, [totalResult]] = await Promise.all([
		db
			.select()
			.from(vitalSigns)
			.where(whereClause)
			.orderBy(vitalSigns.recordedAt)
			.limit(pageSize)
			.offset(offset),
		db.select({ value: count() }).from(vitalSigns).where(whereClause),
	]);

	return {
		data: rows.map(toVitalSignResponse),
		total: totalResult?.value ?? 0,
		page,
		pageSize,
	};
}

export async function getVitalSignById(
	db: Db,
	patientId: string,
	id: string,
): Promise<VitalSignResponse> {
	const [row] = await db
		.select()
		.from(vitalSigns)
		.where(and(eq(vitalSigns.id, id), eq(vitalSigns.patientId, patientId)))
		.limit(1);

	if (!row) {
		throw new VitalSignNotFoundError(id);
	}

	return toVitalSignResponse(row);
}

export async function createVitalSign(
	db: Db,
	patientId: string,
	data: CreateVitalSignBody,
): Promise<VitalSignResponse> {
	await assertPatientExists(db, patientId);

	const [created] = await db
		.insert(vitalSigns)
		.values({ ...data, patientId, recordedAt: new Date(data.recordedAt) })
		.returning();

	if (!created) {
		throw new Error("Failed to create vital sign record");
	}

	return toVitalSignResponse(created);
}

export async function updateVitalSign(
	db: Db,
	patientId: string,
	id: string,
	data: UpdateVitalSignBody,
): Promise<VitalSignResponse> {
	const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };
	if (data.recordedAt) {
		updateData.recordedAt = new Date(data.recordedAt);
	}

	const [updated] = await db
		.update(vitalSigns)
		.set(updateData)
		.where(and(eq(vitalSigns.id, id), eq(vitalSigns.patientId, patientId)))
		.returning();

	if (!updated) {
		throw new VitalSignNotFoundError(id);
	}

	return toVitalSignResponse(updated);
}

export async function deleteVitalSign(db: Db, patientId: string, id: string): Promise<void> {
	const [deleted] = await db
		.delete(vitalSigns)
		.where(and(eq(vitalSigns.id, id), eq(vitalSigns.patientId, patientId)))
		.returning({ id: vitalSigns.id });

	if (!deleted) {
		throw new VitalSignNotFoundError(id);
	}
}

function toVitalSignResponse(row: typeof vitalSigns.$inferSelect): VitalSignResponse {
	return {
		id: row.id,
		patientId: row.patientId,
		recordedAt: row.recordedAt.toISOString(),
		heartRate: row.heartRate ?? null,
		respiratoryRate: row.respiratoryRate ?? null,
		spo2: row.spo2 ?? null,
		systolicBp: row.systolicBp ?? null,
		diastolicBp: row.diastolicBp ?? null,
		temperature: row.temperature ?? null,
		weight: row.weight ?? null,
		height: row.height ?? null,
		painScore: row.painScore ?? null,
		recordedBy: row.recordedBy ?? null,
		notes: row.notes ?? null,
		createdAt: row.createdAt.toISOString(),
		updatedAt: row.updatedAt.toISOString(),
	};
}
