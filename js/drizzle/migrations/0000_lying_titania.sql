CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other', 'prefer_not_to_say');--> statement-breakpoint
CREATE TYPE "public"."medication_route" AS ENUM('oral', 'iv', 'im', 'subcutaneous', 'topical', 'inhaled', 'sublingual', 'other');--> statement-breakpoint
CREATE TYPE "public"."medication_status" AS ENUM('active', 'discontinued', 'completed', 'on_hold');--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"date_of_birth" varchar(10) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(30),
	"gender" "gender",
	"address" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vital_signs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"recorded_at" timestamp NOT NULL,
	"heart_rate" integer,
	"respiratory_rate" integer,
	"spo2" real,
	"systolic_bp" integer,
	"diastolic_bp" integer,
	"temperature" real,
	"weight" real,
	"height" real,
	"pain_score" integer,
	"recorded_by" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"generic_name" varchar(255),
	"dosage" varchar(100) NOT NULL,
	"route" "medication_route" NOT NULL,
	"frequency" varchar(100) NOT NULL,
	"start_date" varchar(10) NOT NULL,
	"end_date" varchar(10),
	"prescriber" varchar(255),
	"status" "medication_status" DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;