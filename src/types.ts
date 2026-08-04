export interface Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

export interface TracePath {
  readonly d: string;
}

export interface ColorGroup {
  readonly color: string;
  readonly hex: string;
  readonly paths: readonly TracePath[];
}

export interface ImgTraceOptions {
  /** Minimum alpha to consider a pixel (0-255). Default: 20 */
  readonly alphaThreshold?: number;
  /** Max colors to extract. Default: 8 */
  readonly maxColors?: number;
  /** Potrace turdSize — suppress specks smaller than this. Default: 1 */
  readonly turdSize?: number;
  /** Potrace optTolerance — path optimization tolerance. Default: 0.1 */
  readonly optTolerance?: number;
}

export interface ImgDimensions {
  readonly width: number;
  readonly height: number;
}

export interface PixelData {
  readonly data: Buffer;
  readonly width: number;
  readonly height: number;
}
