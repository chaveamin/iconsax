export const MODES = ["straight", "rounded"] as const;
export const STYLES = [
  "bold",
  "broken",
  "bulk",
  "linear",
  "outline",
  "twotone",
] as const;

export type Mode = (typeof MODES)[number];
export type Style = (typeof STYLES)[number];
export type Framework =
  | "svg"
  | "react"
  | "vue"
  | "svelte"
  | "html"
  | "webcomponent";

export const FRAMEWORKS: { id: Framework; label: string; ext: string }[] = [
  { id: "svg", label: "SVG", ext: "svg" },
  { id: "react", label: "React", ext: "jsx" },
  { id: "vue", label: "Vue", ext: "vue" },
  { id: "svelte", label: "Svelte", ext: "svelte" },
  { id: "html", label: "HTML", ext: "html" },
  { id: "webcomponent", label: "Web Component", ext: "js" },
];
