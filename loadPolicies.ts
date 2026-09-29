import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { Policy } from "./types";

export function loadPolicies(): Policy[] {
  const filePath = path.join(process.cwd(), "data", "company_policies.csv");
  const fileContent = fs.readFileSync(filePath, "utf8");

  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Policy[];
}
