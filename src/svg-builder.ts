import { ImgDimensions } from "./types";

interface SvgPathGroup {
  readonly fill: string;
  readonly paths: readonly string[];
}

export function buildSvg(
  dimensions: ImgDimensions,
  groups: readonly SvgPathGroup[]
): string {
  const lines: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}">`,
  ];

  for (const group of groups) {
    if (group.paths.length === 0) continue;
    lines.push(`  <g fill="${group.fill}">`);
    for (const d of group.paths) {
      lines.push(`    <path d="${d}"/>`);
    }
    lines.push("  </g>");
  }

  lines.push("</svg>");
  return lines.join("\n");
}
