import { Color } from "./types";

const TARGET_COLORS: readonly Color[] = [
  { r: 167, g: 169, b: 172, a: 255 },
  { r: 146, g: 200, b: 62, a: 255 },
];

export function euclideanDistance(a: Color, b: Color): number {
  return (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2;
}

export function closestTargetColor(
  pixel: Color,
  targets: readonly Color[] = TARGET_COLORS
): number {
  let minDist = Infinity;
  let minIdx = 0;

  for (let i = 0; i < targets.length; i++) {
    const dist = euclideanDistance(pixel, targets[i]);
    if (dist < minDist) {
      minDist = dist;
      minIdx = i;
    }
  }

  return minIdx;
}

export function extractDominantColors(
  data: Buffer,
  pixelCount: number,
  alphaThreshold: number,
  maxColors: number
): Color[] {
  const colorCounts = new Map<string, { color: Color; count: number }>();

  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4;
    const a = data[offset + 3];
    if (a <= alphaThreshold) continue;

    const color: Color = {
      r: data[offset],
      g: data[offset + 1],
      b: data[offset + 2],
      a,
    };
    const key = `${color.r},${color.g},${color.b}`;

    const existing = colorCounts.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorCounts.set(key, { color, count: 1 });
    }
  }

  return Array.from(colorCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, maxColors)
    .map((entry) => entry.color);
}
