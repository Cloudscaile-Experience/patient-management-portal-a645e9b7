import type * as schema from "@/db/schema/index.js";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export type Db = NodePgDatabase<typeof schema>;
