import { BaseRecord } from "@/records/base.record.ts";

export interface LogRecord extends BaseRecord {
  message: string;
}
