import "dotenv/config";
import * as schema from "@/db/schema/index.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pgHost = process.env.PG_HOST;
const pgPort = process.env.PG_PORT;
const pgUsername = process.env.PG_USERNAME;
const pgPassword = process.env.PG_PASSWORD;
const pgDatabase = process.env.PG_DB;

for (const [key, val] of Object.entries({
	PG_HOST: pgHost,
	PG_PORT: pgPort,
	PG_USERNAME: pgUsername,
	PG_PASSWORD: pgPassword,
	PG_DB: pgDatabase,
})) {
	if (!val) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
}

const pool = new Pool({
	host: pgHost,
	port: pgPort ? Number(pgPort) : 5432,
	user: pgUsername,
	password: pgPassword,
	database: pgDatabase,
});
const db = drizzle(pool, { schema });

const patientRecords = [
	{
		name: "John Smith",
		dateOfBirth: "1979-03-12",
		email: "john.smith@example.com",
		phone: "+14155550101",
		gender: "male" as const,
		address: "42 Maple Ave, Springfield, IL 62701",
	},
	{
		name: "Emily Johnson",
		dateOfBirth: "1992-07-28",
		email: "emily.johnson@example.com",
		phone: "+14155550102",
		gender: "female" as const,
		address: "17 Oak St, Portland, OR 97201",
	},
	{
		name: "Michael Davis",
		dateOfBirth: "1957-11-05",
		email: "michael.davis@example.com",
		phone: "+14155550103",
		gender: "male" as const,
		address: "88 Pine Rd, Austin, TX 73301",
	},
	{
		name: "Sarah Wilson",
		dateOfBirth: "1998-02-14",
		email: "sarah.wilson@example.com",
		phone: "+14155550104",
		gender: "female" as const,
		address: "5 Elm Blvd, Denver, CO 80201",
	},
	{
		name: "Robert Brown",
		dateOfBirth: "1971-09-30",
		email: "robert.brown@example.com",
		phone: "+14155550105",
		gender: "male" as const,
		address: "123 Cedar Ln, Boston, MA 02101",
	},
];

async function seed(): Promise<void> {
	process.stdout.write("Clearing existing seed data...\n");

	await db.delete(schema.vitalSigns);
	await db.delete(schema.medications);
	await db.delete(schema.patients);

	process.stdout.write("Inserting patients...\n");
	const insertedPatients = await db.insert(schema.patients).values(patientRecords).returning();

	for (const patient of insertedPatients) {
		process.stdout.write(`  Seeding data for patient: ${patient.name}\n`);

		const baseDate = new Date("2024-06-20T00:00:00.000Z");

		const vitals = [
			{
				patientId: patient.id,
				recordedAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000),
				heartRate: 74 + Math.floor(Math.random() * 10),
				respiratoryRate: 15 + Math.floor(Math.random() * 4),
				spo2: 97 + Math.random(),
				systolicBp: 118 + Math.floor(Math.random() * 12),
				diastolicBp: 76 + Math.floor(Math.random() * 8),
				temperature: 36.5 + Math.random() * 0.8,
				weight: 65 + Math.random() * 30,
				height: 165 + Math.random() * 20,
				painScore: Math.floor(Math.random() * 4),
				recordedBy: "Nurse Practitioner A",
				notes: "Routine vital signs check",
			},
			{
				patientId: patient.id,
				recordedAt: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000),
				heartRate: 70 + Math.floor(Math.random() * 12),
				respiratoryRate: 14 + Math.floor(Math.random() * 5),
				spo2: 96.5 + Math.random() * 1.5,
				systolicBp: 116 + Math.floor(Math.random() * 14),
				diastolicBp: 74 + Math.floor(Math.random() * 10),
				temperature: 36.4 + Math.random() * 1.0,
				weight: 65 + Math.random() * 30,
				height: 165 + Math.random() * 20,
				painScore: Math.floor(Math.random() * 3),
				recordedBy: "Nurse Practitioner B",
				notes: "Follow-up observation",
			},
			{
				patientId: patient.id,
				recordedAt: baseDate,
				heartRate: 72 + Math.floor(Math.random() * 8),
				respiratoryRate: 16 + Math.floor(Math.random() * 3),
				spo2: 97 + Math.random() * 2,
				systolicBp: 120 + Math.floor(Math.random() * 10),
				diastolicBp: 78 + Math.floor(Math.random() * 6),
				temperature: 36.6 + Math.random() * 0.6,
				weight: 65 + Math.random() * 30,
				height: 165 + Math.random() * 20,
				painScore: Math.floor(Math.random() * 3),
				recordedBy: "Dr. Chen",
				notes: "Pre-consultation check",
			},
		];

		await db.insert(schema.vitalSigns).values(vitals);
	}

	// Per-patient medications (realistic for common conditions)
	const [john, emily, michael, sarah, robert] = insertedPatients;
	if (!john || !emily || !michael || !sarah || !robert) {
		throw new Error("Seed failed: expected 5 patients to be inserted");
	}

	const medicationData = [
		// John — hypertension
		{
			patientId: john.id,
			name: "Lisinopril",
			genericName: "Lisinopril",
			dosage: "10 mg",
			route: "oral" as const,
			frequency: "once daily",
			startDate: "2023-01-15",
			prescriber: "Dr. Adams",
			status: "active" as const,
			notes: "ACE inhibitor for blood pressure control",
		},
		{
			patientId: john.id,
			name: "Amlodipine",
			genericName: "Amlodipine besylate",
			dosage: "5 mg",
			route: "oral" as const,
			frequency: "once daily",
			startDate: "2023-06-01",
			prescriber: "Dr. Adams",
			status: "active" as const,
			notes: "Calcium channel blocker, added for better BP control",
		},
		// Emily — Type 2 diabetes
		{
			patientId: emily.id,
			name: "Metformin",
			genericName: "Metformin hydrochloride",
			dosage: "500 mg",
			route: "oral" as const,
			frequency: "twice daily with meals",
			startDate: "2022-03-10",
			prescriber: "Dr. Patel",
			status: "active" as const,
			notes: "First-line therapy for T2DM",
		},
		{
			patientId: emily.id,
			name: "Ozempic",
			genericName: "Semaglutide",
			dosage: "0.5 mg",
			route: "subcutaneous" as const,
			frequency: "once weekly",
			startDate: "2023-09-20",
			prescriber: "Dr. Patel",
			status: "active" as const,
			notes: "GLP-1 agonist for glycemic control and weight reduction",
		},
		// Michael — COPD
		{
			patientId: michael.id,
			name: "Spiriva",
			genericName: "Tiotropium bromide",
			dosage: "18 mcg",
			route: "inhaled" as const,
			frequency: "once daily",
			startDate: "2020-05-01",
			prescriber: "Dr. Lee",
			status: "active" as const,
			notes: "LAMA bronchodilator for COPD maintenance",
		},
		{
			patientId: michael.id,
			name: "Ventolin",
			genericName: "Salbutamol",
			dosage: "100 mcg / puff",
			route: "inhaled" as const,
			frequency: "as needed (max 4x daily)",
			startDate: "2020-05-01",
			prescriber: "Dr. Lee",
			status: "active" as const,
			notes: "Rescue inhaler for acute breathlessness",
		},
		// Sarah — asthma
		{
			patientId: sarah.id,
			name: "Flixotide",
			genericName: "Fluticasone propionate",
			dosage: "125 mcg / puff",
			route: "inhaled" as const,
			frequency: "twice daily",
			startDate: "2021-08-15",
			prescriber: "Dr. Martinez",
			status: "active" as const,
			notes: "Inhaled corticosteroid for asthma prophylaxis",
		},
		{
			patientId: sarah.id,
			name: "Cetirizine",
			genericName: "Cetirizine hydrochloride",
			dosage: "10 mg",
			route: "oral" as const,
			frequency: "once daily at night",
			startDate: "2022-04-01",
			endDate: "2022-10-01",
			prescriber: "Dr. Martinez",
			status: "completed" as const,
			notes: "Seasonal antihistamine — course completed",
		},
		// Robert — hypothyroidism
		{
			patientId: robert.id,
			name: "Synthroid",
			genericName: "Levothyroxine sodium",
			dosage: "75 mcg",
			route: "oral" as const,
			frequency: "once daily on empty stomach",
			startDate: "2018-11-01",
			prescriber: "Dr. Kim",
			status: "active" as const,
			notes: "Thyroid hormone replacement therapy",
		},
		{
			patientId: robert.id,
			name: "Rosuvastatin",
			genericName: "Rosuvastatin calcium",
			dosage: "10 mg",
			route: "oral" as const,
			frequency: "once daily at night",
			startDate: "2022-02-15",
			prescriber: "Dr. Kim",
			status: "active" as const,
			notes: "Statin for cardiovascular risk reduction",
		},
	];

	process.stdout.write("Inserting medications...\n");
	await db.insert(schema.medications).values(medicationData);

	process.stdout.write(
		`\nSeed complete: ${insertedPatients.length} patients, ${3 * insertedPatients.length} vital sign readings, ${medicationData.length} medications.\n`,
	);
}

seed()
	.catch((err) => {
		process.stderr.write(`Seed failed: ${String(err)}\n`);
		process.exit(1);
	})
	.finally(() => pool.end());
