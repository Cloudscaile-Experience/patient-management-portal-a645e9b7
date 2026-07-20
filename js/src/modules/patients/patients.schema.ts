import { type Static, Type } from "@sinclair/typebox";

const GenderEnum = Type.Union([
	Type.Literal("male"),
	Type.Literal("female"),
	Type.Literal("other"),
	Type.Literal("prefer_not_to_say"),
]);

export const PatientResponse = Type.Object({
	id: Type.String({ format: "uuid" }),
	name: Type.String(),
	dateOfBirth: Type.String(),
	email: Type.String({ format: "email" }),
	phone: Type.Union([Type.String(), Type.Null()]),
	gender: Type.Union([GenderEnum, Type.Null()]),
	address: Type.Union([Type.String(), Type.Null()]),
	createdAt: Type.String({ format: "date-time" }),
	updatedAt: Type.String({ format: "date-time" }),
});
export type PatientResponse = Static<typeof PatientResponse>;

export const CreatePatientBody = Type.Object({
	name: Type.String({ minLength: 1, maxLength: 255 }),
	dateOfBirth: Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$", description: "YYYY-MM-DD" }),
	email: Type.String({ format: "email", maxLength: 255 }),
	phone: Type.Optional(Type.String({ maxLength: 30 })),
	gender: Type.Optional(GenderEnum),
	address: Type.Optional(Type.String({ maxLength: 500 })),
});
export type CreatePatientBody = Static<typeof CreatePatientBody>;

export const UpdatePatientBody = Type.Partial(
	Type.Object({
		name: Type.String({ minLength: 1, maxLength: 255 }),
		dateOfBirth: Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" }),
		phone: Type.String({ maxLength: 30 }),
		gender: GenderEnum,
		address: Type.String({ maxLength: 500 }),
	}),
);
export type UpdatePatientBody = Static<typeof UpdatePatientBody>;

export const PatientIdParam = Type.Object({
	id: Type.String({ format: "uuid" }),
});
export type PatientIdParam = Static<typeof PatientIdParam>;

export const ListPatientsQuerystring = Type.Object({
	page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
	pageSize: Type.Optional(Type.Integer({ minimum: 1, maximum: 100, default: 20 })),
	search: Type.Optional(Type.String({ maxLength: 100 })),
});
export type ListPatientsQuerystring = Static<typeof ListPatientsQuerystring>;

export const PaginatedPatientsResponse = Type.Object({
	data: Type.Array(PatientResponse),
	total: Type.Integer(),
	page: Type.Integer(),
	pageSize: Type.Integer(),
});
export type PaginatedPatientsResponse = Static<typeof PaginatedPatientsResponse>;
