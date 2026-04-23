import { promises as fs } from "fs";
import path from "path";

export interface IconMeta {
  mode: string;
  category: string;
  style: string;
  name: string;
  path: string;
}

export async function GET() {
  const iconsDir = path.join(process.cwd(), "public/icons");
  const modes = ["straight", "rounded"];
  const styles = ["bold", "broken", "bulk", "linear", "outline", "twotone"];
  const result: IconMeta[] = [];

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

  return Response.json(result);
}
