import fs from "fs";
import path from "path";

let searchMap: Map<string, string[]> | null = null;

export function getSearchIndex(): Map<string, string[]> {
  if (searchMap) return searchMap;
  searchMap = new Map();
  const filePath = path.join(process.cwd(), "src/data/iconSearchQueries.txt");
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const [iconName, tagsPart] = trimmed.split("_");
    if (!iconName || !tagsPart) continue;
    const tags = tagsPart.split("-").map((t) => t.trim().toLowerCase());
    searchMap.set(iconName, tags);
  }
  return searchMap;
}
