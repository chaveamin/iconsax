import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const iconsDir = path.join(__dirname, "..", "public", "icons");
const outputFile = path.join(__dirname, "..", "public", "icons-metadata.json");
const modes = ["straight", "rounded"];
const styles = ["bold", "broken", "bulk", "linear", "outline", "twotone"];

async function generate() {
  const result = [];

  for (const mode of modes) {
    const modePath = path.join(iconsDir, mode);
    try {
      const categories = await fs.readdir(modePath);
      for (const category of categories) {
        const catPath = path.join(modePath, category);
        const stat = await fs.stat(catPath);
        if (!stat.isDirectory()) continue;
        for (const style of styles) {
          const stylePath = path.join(catPath, style);
          try {
            const files = await fs.readdir(stylePath);
            for (const file of files) {
              if (file.endsWith(".svg")) {
                const name = path.basename(file, ".svg");
                result.push({
                  mode,
                  category,
                  style,
                  name,
                  path: `/icons/${mode}/${category}/${style}/${file}`,
                });
              }
            }
          } catch {}
        }
      }
    } catch {}
  }

  await fs.writeFile(outputFile, JSON.stringify(result, null, 2));
  console.log(`✅ Generated ${result.length} icons metadata to ${outputFile}`);
}

generate().catch(console.error);
