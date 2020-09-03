import { createBitFieldCodec } from './bitfield';
import { ColorArr } from './types';

export enum ColorEncoding {
  RGB = 0,
  LMS = 1,
  HSL = 2,
}

function cap(value: number, min: number, max: number): number {
  return Math.min(Math.max(Math.round(value), min), max);
}

export interface ColorCodec {
  encode: (
    channelA: number,
    channelB: number,
    channelC: number,
    encoding: ColorEncoding,
  ) => number;
  decode: (bitfield: number) => ColorArr;
  setValueAt: (
    bitfield: number,
    index: number,
    value: number,
  ) => number;
  getValueAt: (bitfield: number, index: number) => number;
  type: (bitfield: number) => ColorEncoding;
  values: (bitfield: number) => Iterable<number>;
}

export function createColorCodec(): ColorCodec {
  const shape = [10, 10, 10, 2];
  const colorBitfield = createBitFieldCodec(shape);
  const scales = [
    2 ** shape[0] - 1,
    2 ** shape[1] - 1,
    2 ** shape[2] - 1,
  ];
  const initBitfields: {
    [K: number]: number;
  } = Object.fromEntries(
    Object.entries(ColorEncoding).map(([, value]) => [
      value,
      colorBitfield.setValueAt(0, 3, value as number),
    ]),
  );

  function setValueAt(
    bitfield: number,
    index: number,
    value: number,
  ): number {
    return colorBitfield.setValueAt(
      bitfield,
      index,
      Math.round(value * scales[index]),
    );
  }

  function encode(
    channelA: number,
    channelB: number,
    channelC: number,
    encoding: ColorEncoding,
  ): number {
    const valueA = cap(channelA * scales[0], 0, scales[0]);
    const valueB = cap(channelB * scales[1], 0, scales[1]);
    const valueC = cap(channelC * scales[2], 0, scales[2]);
    const initBitfield = initBitfields[encoding];
    const fieldA = colorBitfield.setValueAt(initBitfield, 0, valueA);
    const fieldB = colorBitfield.setValueAt(fieldA, 1, valueB);
    return colorBitfield.setValueAt(fieldB, 2, valueC);
  }

  function getValueAt(bitfield: number, index: number): number {
    return colorBitfield.getValueAt(bitfield, index) / scales[index];
  }

  function decode(bitfield: number): ColorArr {
    return [
      getValueAt(bitfield, 0),
      getValueAt(bitfield, 1),
      getValueAt(bitfield, 2),
    ];
  }

  function type(bitfield: number): ColorEncoding {
    return colorBitfield.getValueAt(bitfield, 3);
  }

  function values(bitfield: number): Iterable<number> {
    return {
      *[Symbol.iterator]() {
        yield getValueAt(bitfield, 0);
        yield getValueAt(bitfield, 1);
        yield getValueAt(bitfield, 2);
      },
    };
  }

  return {
    encode,
    decode,
    setValueAt,
    getValueAt,
    type,
    values,
  };
}

export const colorCodec = createColorCodec();
