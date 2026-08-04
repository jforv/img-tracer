# img-tracer

Convert raster images (PNG, JPEG, etc.) into inline SVG strings using color separation and [potrace](https://github.com/tooolbox/node-potrace).

## Install

```bash
npm install img-tracer
```

## Usage

```typescript
import { imgTrace } from "img-tracer";

const svg = await imgTrace("/img/logo.png");
```

The returned string is a complete, self-contained inline SVG:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g fill="#A7A9AC">
    <path d="..."/>
  </g>
  <g fill="#92C83E">
    <path d="..."/>
  </g>
</svg>
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `alphaThreshold` | `number` | `20` | Minimum alpha (0-255) for a pixel to be considered opaque |
| `maxColors` | `number` | `8` | Maximum number of dominant colors to trace |
| `turdSize` | `number` | `1` | Potrace: suppress specks smaller than this size |
| `optTolerance` | `number` | `0.1` | Potrace: path optimization tolerance |

```typescript
const svg = await imgTrace("/img/logo.png", {
  alphaThreshold: 30,
  maxColors: 5,
  turdSize: 2,
  optTolerance: 0.15,
});
```

## How it works

1. **Read** — Loads the image with [Jimp](https://github.com/jimp-dev/jimp).
2. **Separate** — Classifies each opaque pixel by Euclidean distance to the dominant target colors, producing a black-and-white mask per color.
3. **Trace** — Runs potrace over each mask to produce vector paths.
4. **Build** — Assembles all paths into a single SVG grouped by color.

## Architecture

```
src/
  types.ts          Interfaces (Color, ImgTraceOptions, PixelData, ...)
  color-utils.ts    Color distance math, dominant color extraction
  tracer.ts         Image I/O, mask creation, potrace tracing
  svg-builder.ts    Pure SVG assembly from path groups
  index.ts          Public API: imgTrace()
  potrace.d.ts      Type declarations for potrace
```

Each module has a single responsibility; the public surface is a single async function with sensible defaults.

## API

### `imgTrace(imagePath: string, options?: ImgTraceOptions): Promise<string>`

Returns a promise resolving to an inline SVG string.

| Argument | Type | Description |
|---|---|---|
| `imagePath` | `string` | Filesystem path to the source image |
| `options` | `ImgTraceOptions` | Optional tracing configuration (see above) |

## Development

```bash
npm install
npm run build      # compile TypeScript to dist/
npm run typecheck  # type-check without emitting
```

## License

MIT
