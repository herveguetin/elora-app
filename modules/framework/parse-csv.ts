import fs from "fs";
import csv from "csv-parser";
import { slugify } from "../framework";

export type CsvRow = Record<string, string>;

export const parseCsvFile = (filePath: string): Promise<CsvRow[]> => {
  return new Promise((resolve, reject) => {
    const results: CsvRow[] = [];

    fs.createReadStream(filePath)
      .pipe(csv({ separator: "," }))
      .on("data", (data: CsvRow) => {
        const finalData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [slugify(key.trim(), "_"), value.trim()])
        );
        results.push(finalData);
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};
