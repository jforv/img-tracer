import { ImgTraceOptions } from "./types";
import { readImage, createMask, traceMask, extractPaths } from "./tracer";
import { buildSvg } from "./svg-builder";

const DEFAULT_COLORS = [
  { r: 167, g: 169, b: 172, a: 255, hex: "#A7A9AC" },
  { r: 146, g: 200, b: 62, a: 255, hex: "#92C83E" },
];

export async function imgTrace(
  imagePath: string,
  options: ImgTraceOptions = {}
): Promise<string> {
  const { alphaThreshold = 20 } = options;

  const pixels = await readImage(imagePath);

  const groupPromises = DEFAULT_COLORS.map(async (target) => {
    const mask = await createMask(pixels, target, alphaThreshold);
    const svg = await traceMask(mask, options);
    const paths = extractPaths(svg);
    return { fill: target.hex, paths: paths.map((p) => p.d) };
  });

  const groups = await Promise.all(groupPromises);

  return buildSvg(
    { width: pixels.width, height: pixels.height },
    groups
  );
}
