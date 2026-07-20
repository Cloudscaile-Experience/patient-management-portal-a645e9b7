import { integer, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { patients } from "./patients.js";

export const vitalSigns = pgTable("vital_signs", {
	id: uuid("id").defaultRandom().primaryKey(),
	patientId: uuid("patient_id")
		.notNull()
		.references(() => patients.id, { onDelete: "cascade" }),
	recordedAt: timestamp("recorded_at").notNull(),
	heartRate: integer("heart_rate"),
	respiratoryRate: integer("respiratory_rate"),
	spo2: real("spo2"),
	systolicBp: integer("systolic_bp"),
	diastolicBp: integer("diastolic_bp"),
	temperature: real("temperature"),
	weight: real("weight"),
	height: real("height"),
	painScore: integer("pain_score"),
	recordedBy: text("recorded_by"),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type VitalSign = typeof vitalSigns.$inferSelect;
export type NewVitalSign = typeof vitalSigns.$inferInsert;
