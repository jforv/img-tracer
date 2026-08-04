declare module "potrace" {
  interface PotraceOptions {
    turdSize?: number;
    optTolerance?: number;
    alphaMax?: number;
    color?: string;
    background?: string;
    threshold?: number;
  }

  function trace(
    image: Buffer | string,
    options: PotraceOptions,
    callback: (err: Error | null, svg: string) => void
  ): void;

  export { trace, PotraceOptions };
}
