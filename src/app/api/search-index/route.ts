import { getSearchIndex } from "@/src/lib/searchIndex";

export async function GET() {
  const index = getSearchIndex();
  // Convert Map to plain object
  const obj = Object.fromEntries(index.entries());
  return Response.json(obj);
}
