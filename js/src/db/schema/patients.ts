import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female", "other", "prefer_not_to_say"]);

export const patients = pgTable("patients", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	dateOfBirth: varchar("date_of_birth", { length: 10 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	phone: varchar("phone", { length: 30 }),
	gender: genderEnum("gender"),
	address: varchar("address", { length: 500 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
