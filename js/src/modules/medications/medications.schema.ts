import { type Static, Type } from "@sinclair/typebox";

const MedicationRouteEnum = Type.Union([
	Type.Literal("oral"),
	Type.Literal("iv"),
	Type.Literal("im"),
	Type.Literal("subcutaneous"),
	Type.Literal("topical"),
	Type.Literal("inhaled"),
	Type.Literal("sublingual"),
	Type.Literal("other"),
]);

const MedicationStatusEnum = Type.Union([
	Type.Literal("active"),
	Type.Literal("discontinued"),
	Type.Literal("completed"),
	Type.Literal("on_hold"),
]);

export const MedicationResponse = Type.Object({
	id: Type.String({ format: "uuid" }),
	patientId: Type.String({ format: "uuid" }),
	name: Type.String(),
	genericName: Type.Union([Type.String(), Type.Null()]),
	dosage: Type.String(),
	route: MedicationRouteEnum,
	frequency: Type.String(),
	startDate: Type.String(),
	endDate: Type.Union([Type.String(), Type.Null()]),
	prescriber: Type.Union([Type.String(), Type.Null()]),
	status: MedicationStatusEnum,
	notes: Type.Union([Type.String(), Type.Null()]),
	createdAt: Type.String({ format: "date-time" }),
	updatedAt: Type.String({ format: "date-time" }),
});
export type MedicationResponse = Static<typeof MedicationResponse>;

export const CreateMedicationBody = Type.Object({
	name: Type.String({ minLength: 1, maxLength: 255, description: "Brand or trade name" }),
	genericName: Type.Optional(Type.String({ maxLength: 255, description: "Generic / INN name" })),
	dosage: Type.String({ minLength: 1, maxLength: 100, description: 'e.g. "500 mg", "10 mg/5 ml"' }),
	route: MedicationRouteEnum,
	frequency: Type.String({ minLength: 1, maxLength: 100, description: 'e.g. "twice daily"' }),
	startDate: Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$", description: "YYYY-MM-DD" }),
	endDate: Type.Optional(
		Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$", description: "YYYY-MM-DD" }),
	),
	prescriber: Type.Optional(Type.String({ maxLength: 255 })),
	status: Type.Optional(MedicationStatusEnum),
	notes: Type.Optional(Type.String({ maxLength: 2000 })),
});
export type CreateMedicationBody = Static<typeof CreateMedicationBody>;

export const UpdateMedicationBody = Type.Partial(CreateMedicationBody);
export type UpdateMedicationBody = Static<typeof UpdateMedicationBody>;

export const MedicationPatientParam = Type.Object({
	patientId: Type.String({ format: "uuid" }),
});
export type MedicationPatientParam = Static<typeof MedicationPatientParam>;

export const MedicationIdParam = Type.Object({
	patientId: Type.String({ format: "uuid" }),
	id: Type.String({ format: "uuid" }),
});
export type MedicationIdParam = Static<typeof MedicationIdParam>;

export const ListMedicationsQuerystring = Type.Object({
	page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
	pageSize: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 20 })),
	status: Type.Optional(MedicationStatusEnum),
});
export type ListMedicationsQuerystring = Static<typeof ListMedicationsQuerystring>;

export const PaginatedMedicationsResponse = Type.Object({
	data: Type.Array(MedicationResponse),
	total: Type.Integer(),
	page: Type.Integer(),
	pageSize: Type.Integer(),
});
export type PaginatedMedicationsResponse = Static<typeof PaginatedMedicationsResponse>;
