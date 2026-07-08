import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const iconsDir = path.join(__dirname, "..", "public", "icons-animated");
const outputFile = path.join(__dirname, "..", "public", "icons-animated-metadata.json");

async function generate() {
  const result = [];

  try {
    const categories = await fs.readdir(iconsDir);
    for (const category of categories) {
      const catPath = path.join(iconsDir, category);
      const stat = await fs.stat(catPath);
      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(catPath);
      for (const file of files) {
        if (file.endsWith(".json")) {
          const name = path.basename(file, ".json");
          result.push({
            category,
            name,
            path: `/icons-animated/${category}/${file}`,
          });
        }
      }
    }
  } catch (err) {
    console.error("Error reading animated icons directory:", err);
  }

  await fs.writeFile(outputFile, JSON.stringify(result, null, 2));
  console.log(`✅ Generated ${result.length} animated icons metadata to ${outputFile}`);
}

generate().catch(console.error);
