import { TracerRecord } from "@/records/tracer.record.ts";

export interface LogTracerRecord extends TracerRecord {
  message: string;
}
