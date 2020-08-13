export function tap<T>(cb: (value: T) => void): (value: T) => T {
  return (value: T) => {
    cb(value);
    return value;
  };
}

export function round(n: number): number {
  return Math.round(n * 1000 + Number.EPSILON) / 1000;
}

export function getIndex(
  x: number,
  y: number,
  width: number,
): number {
  return y * width + x;
}

export function getX(i: number, width: number): number {
  return i % width;
}

export function getY(i: number, width: number): number {
  return Math.floor(i / width);
}
