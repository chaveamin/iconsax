export function getViewBox(svg: string): string {
  return svg.match(/viewBox="([^"]*)"/)?.[1] ?? "0 0 24 24";
}

export function getInnerSvg(svg: string): string {
  return svg
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();
}

export function toComponentName(displayName: string): string {
  return (
    displayName
      .split(/[-_\s]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("")
      .replace(/[^a-zA-Z0-9]/g, "") || "Icon"
  );
}

export function generateReact(svg: string, displayName: string): string {
  const viewBox = getViewBox(svg);
  const inner = getInnerSvg(svg);
  const name = toComponentName(displayName);
  return `export const ${name} = ({ size = 24, color = "#000000" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="${viewBox}"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      ${inner}
    </svg>
  );
};`;
}

export function generateVue(svg: string): string {
  const viewBox = getViewBox(svg);
  const inner = getInnerSvg(svg);
  return `<script setup>
defineProps({ size: { type: Number, default: 24 }, color: { type: String, default: "#000000" } });
</script>

<template>
  <svg :width="size" :height="size" viewBox="\`${viewBox}\`" :fill="color" xmlns="http://www.w3.org/2000/svg">
    ${inner}
  </svg>
</template>`;
}

export function generateSvelte(svg: string): string {
  const viewBox = getViewBox(svg);
  const inner = getInnerSvg(svg);
  return `<script>
  export let size = 24;
  export let color = "#000000";
</script>

<svg width="{size}" height="{size}" viewBox="${viewBox}" fill={color} xmlns="http://www.w3.org/2000/svg">
  ${inner}
</svg>`;
}

export function generateHtml(svg: string, displayName: string): string {
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `<img src="data:image/svg+xml;base64,${base64}" alt="${displayName}" width="24" height="24" />`;
}

export function generateWebComponent(svg: string, displayName: string): string {
  const viewBox = getViewBox(svg);
  const inner = getInnerSvg(svg).replace(/`/g, "\\`");
  const tagName = `icon-${displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
  const className = toComponentName(displayName) + "Icon";

  return `class ${className} extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.size = this.getAttribute("size") || "24";
    this.color = this.getAttribute("color") || "#000000";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = \`
      <svg
        width="\${this.size}"
        height="\${this.size}"
        viewBox="${viewBox}"
        fill="\${this.color}"
        xmlns="http://www.w3.org/2000/svg"
      >
        ${inner}
      </svg>
    \`;
  }
}

customElements.define("${tagName}", ${className});`;
}
