import { pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { patients } from "./patients.js";

export const medicationRouteEnum = pgEnum("medication_route", [
	"oral",
	"iv",
	"im",
	"subcutaneous",
	"topical",
	"inhaled",
	"sublingual",
	"other",
]);

export const medicationStatusEnum = pgEnum("medication_status", [
	"active",
	"discontinued",
	"completed",
	"on_hold",
]);

export const medications = pgTable("medications", {
	id: uuid("id").defaultRandom().primaryKey(),
	patientId: uuid("patient_id")
		.notNull()
		.references(() => patients.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 255 }).notNull(),
	genericName: varchar("generic_name", { length: 255 }),
	dosage: varchar("dosage", { length: 100 }).notNull(),
	route: medicationRouteEnum("route").notNull(),
	frequency: varchar("frequency", { length: 100 }).notNull(),
	startDate: varchar("start_date", { length: 10 }).notNull(),
	endDate: varchar("end_date", { length: 10 }),
	prescriber: varchar("prescriber", { length: 255 }),
	status: medicationStatusEnum("status").default("active").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Medication = typeof medications.$inferSelect;
export type NewMedication = typeof medications.$inferInsert;
