import { Jimp } from "jimp";
import * as potrace from "potrace";
import { ImgTraceOptions, PixelData, Color, TracePath } from "./types";
import { closestTargetColor } from "./color-utils";

const POTRACE_DEFAULTS = {
  turdSize: 1,
  optTolerance: 0.1,
  alphaMax: 1.0,
};

export async function readImage(imagePath: string): Promise<PixelData> {
  const image = await Jimp.read(imagePath);
  return {
    data: Buffer.from(image.bitmap.data),
    width: image.bitmap.width,
    height: image.bitmap.height,
  };
}

export async function createMask(
  pixels: PixelData,
  targetColor: Color,
  alphaThreshold: number
): Promise<Buffer> {
  const mask = new Jimp({
    width: pixels.width,
    height: pixels.height,
    color: 0xffffffff,
  });

  const { data, width } = pixels;
  const pixelCount = width * pixels.height;

  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4;
    const a = data[offset + 3];
    if (a <= alphaThreshold) continue;

    const pixel: Color = {
      r: data[offset],
      g: data[offset + 1],
      b: data[offset + 2],
      a,
    };

    const match = closestTargetColor(pixel, [targetColor]);
    if (match === 0) {
      const x = i % width;
      const y = Math.floor(i / width);
      mask.setPixelColor(0x000000ff, x, y);
    }
  }

  return mask.getBuffer("image/png");
}

export function traceMask(
  maskBuffer: Buffer,
  options: ImgTraceOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    potrace.trace(
      maskBuffer,
      {
        turdSize: options.turdSize ?? POTRACE_DEFAULTS.turdSize,
        optTolerance: options.optTolerance ?? POTRACE_DEFAULTS.optTolerance,
        alphaMax: POTRACE_DEFAULTS.alphaMax,
      },
      (err, svg) => {
        if (err) reject(err);
        else resolve(svg);
      }
    );
  });
}

export function extractPaths(svgString: string): TracePath[] {
  const matches = svgString.match(/d="([^"]+)"/g);
  if (!matches) return [];

  return matches
    .map((m) => {
      const dMatch = m.match(/d="([^"]+)"/);
      return dMatch ? { d: dMatch[1] } : null;
    })
    .filter((p): p is TracePath => p !== null);
}
