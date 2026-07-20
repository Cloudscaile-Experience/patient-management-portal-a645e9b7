import { type Static, Type } from "@sinclair/typebox";

export const VitalSignResponse = Type.Object({
	id: Type.String({ format: "uuid" }),
	patientId: Type.String({ format: "uuid" }),
	recordedAt: Type.String({ format: "date-time" }),
	heartRate: Type.Union([Type.Integer(), Type.Null()]),
	respiratoryRate: Type.Union([Type.Integer(), Type.Null()]),
	spo2: Type.Union([Type.Number(), Type.Null()]),
	systolicBp: Type.Union([Type.Integer(), Type.Null()]),
	diastolicBp: Type.Union([Type.Integer(), Type.Null()]),
	temperature: Type.Union([Type.Number(), Type.Null()]),
	weight: Type.Union([Type.Number(), Type.Null()]),
	height: Type.Union([Type.Number(), Type.Null()]),
	painScore: Type.Union([Type.Integer(), Type.Null()]),
	recordedBy: Type.Union([Type.String(), Type.Null()]),
	notes: Type.Union([Type.String(), Type.Null()]),
	createdAt: Type.String({ format: "date-time" }),
	updatedAt: Type.String({ format: "date-time" }),
});
export type VitalSignResponse = Static<typeof VitalSignResponse>;

export const CreateVitalSignBody = Type.Object({
	recordedAt: Type.String({ format: "date-time", description: "ISO 8601 datetime" }),
	heartRate: Type.Optional(
		Type.Integer({ minimum: 0, maximum: 300, description: "Heart rate in bpm" }),
	),
	respiratoryRate: Type.Optional(
		Type.Integer({ minimum: 0, maximum: 100, description: "Breaths per minute" }),
	),
	spo2: Type.Optional(
		Type.Number({ minimum: 0, maximum: 100, description: "Blood oxygen saturation %" }),
	),
	systolicBp: Type.Optional(
		Type.Integer({ minimum: 0, maximum: 400, description: "Systolic blood pressure mmHg" }),
	),
	diastolicBp: Type.Optional(
		Type.Integer({ minimum: 0, maximum: 300, description: "Diastolic blood pressure mmHg" }),
	),
	temperature: Type.Optional(
		Type.Number({ minimum: 25, maximum: 45, description: "Temperature in Celsius" }),
	),
	weight: Type.Optional(Type.Number({ minimum: 0, maximum: 700, description: "Weight in kg" })),
	height: Type.Optional(Type.Number({ minimum: 0, maximum: 300, description: "Height in cm" })),
	painScore: Type.Optional(
		Type.Integer({ minimum: 0, maximum: 10, description: "Pain score 0–10" }),
	),
	recordedBy: Type.Optional(Type.String({ maxLength: 255 })),
	notes: Type.Optional(Type.String({ maxLength: 2000 })),
});
export type CreateVitalSignBody = Static<typeof CreateVitalSignBody>;

export const UpdateVitalSignBody = Type.Partial(CreateVitalSignBody);
export type UpdateVitalSignBody = Static<typeof UpdateVitalSignBody>;

export const VitalSignPatientParam = Type.Object({
	patientId: Type.String({ format: "uuid" }),
});
export type VitalSignPatientParam = Static<typeof VitalSignPatientParam>;

export const VitalSignIdParam = Type.Object({
	patientId: Type.String({ format: "uuid" }),
	id: Type.String({ format: "uuid" }),
});
export type VitalSignIdParam = Static<typeof VitalSignIdParam>;

export const ListVitalSignsQuerystring = Type.Object({
	page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
	pageSize: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 20 })),
	from: Type.Optional(Type.String({ format: "date-time", description: "Filter from datetime" })),
	to: Type.Optional(Type.String({ format: "date-time", description: "Filter to datetime" })),
});
export type ListVitalSignsQuerystring = Static<typeof ListVitalSignsQuerystring>;

export const PaginatedVitalSignsResponse = Type.Object({
	data: Type.Array(VitalSignResponse),
	total: Type.Integer(),
	page: Type.Integer(),
	pageSize: Type.Integer(),
});
export type PaginatedVitalSignsResponse = Static<typeof PaginatedVitalSignsResponse>;
