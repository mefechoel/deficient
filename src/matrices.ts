import { colorCodec } from './colorCodec';
import { getIndex, getX } from './util';

export interface Matrix<W extends number, H extends number> {
  width: number;
  height: number;
  data: number[];
}

export function createMatrix<W extends number, H extends number>(
  width: W,
  height: H,
  data: number[],
): Matrix<W, H> {
  if (data.length !== width * height) {
    throw new Error(
      'The provided matrix data has an invalid shape. ' +
        `Expected length ${width * height}, got ${data.length}`,
    );
  }
  return { width, height, data };
}

export const identity = createMatrix(3, 3, [
  1, 0, 0, // eslint-disable-line prettier/prettier
  0, 1, 0, // eslint-disable-line prettier/prettier
  0, 0, 1, // eslint-disable-line prettier/prettier
]);

export function multiply<
  WA extends number,
  HA extends number,
  WB extends number
>(a: Matrix<WA, HA>, b: Matrix<WB, WA>): Matrix<WB, HA> {
  const data: number[] = [];
  for (let yA = 0; yA < a.height; yA++) {
    for (let xB = 0; xB < b.width; xB++) {
      let elem = 0;
      for (let xA = 0; xA < a.width; xA++) {
        const iA = getIndex(xA, yA, a.width);
        const x = getX(iA, a.width);
        const iB = getIndex(xB, x, b.width);
        const elemA = a.data[iA];
        const elemB = b.data[iB];
        elem += elemA * elemB;
      }
      data.push(elem);
    }
  }
  return createMatrix(b.width, a.height, data);
}

export function _multiplyColor(
  conversionMatrix: Matrix<3, 3>,
  color: number,
): number {
  let nextColor = color;
  for (let y = 0; y < 3; y++) {
    let channel = 0;
    for (let x = 0; x < 3; x++) {
      const iConversionM = y * 3 + x;
      const elemA = conversionMatrix.data[iConversionM];
      const elemB = colorCodec.getValueAt(color, x);
      channel += elemA * elemB;
    }
    nextColor = colorCodec.setValueAt(nextColor, y, channel);
  }
  return nextColor;
}

export function multiplyColor(
  conversionMatrix: Matrix<3, 3>,
  color: number,
): number {
  const cM = conversionMatrix.data;
  const a = colorCodec.getValueAt(color, 0);
  const b = colorCodec.getValueAt(color, 1);
  const c = colorCodec.getValueAt(color, 2);
  const type = colorCodec.type(color);
  const transA = cM[0] * a + cM[1] * b + cM[2] * c;
  const transB = cM[3] * a + cM[4] * b + cM[5] * c;
  const transC = cM[6] * a + cM[7] * b + cM[8] * c;
  return colorCodec.encode(transA, transB, transC, type);
}
