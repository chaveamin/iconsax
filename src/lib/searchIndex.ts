export function getSearchTerms(iconName: string): string[] {
  const baseName = iconName.split("_")[0];
  return baseName.split("-").map((t) => t.toLowerCase());
}
