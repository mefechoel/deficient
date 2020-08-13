export function createBitFieldCodec(
  shape: ReadonlyArray<number>,
): {
  encode: (data: ReadonlyArray<number>) => number;
  decode: (bitField: number) => ReadonlyArray<number>;
  setValueAt: (
    bitField: number,
    index: number,
    value: number,
  ) => number;
  getValueAt: (bitField: number, index: number) => number;
  length: number;
} {
  const masks = shape.map((bitDepth, i, arr) => {
    const max = 2 ** bitDepth - 1;
    const shift = arr
      .filter((x, j) => j < i)
      .reduce((acc, x) => acc + x, 0);
    const mask = max << shift;
    return { max, mask, shift };
  });

  function setValueAt(
    bitField: number,
    index: number,
    value: number,
  ): number {
    return (
      bitField | (masks[index].mask & (value << masks[index].shift))
    );
  }

  function encode(data: ReadonlyArray<number>): number {
    let bitField = 0;
    for (let i = 0; i < masks.length; i++) {
      bitField = setValueAt(bitField, i, data[i]);
      // bitField |= masks[i].mask & (data[i] << masks[i].shift);
    }
    return bitField;
  }

  function getValueAt(bitField: number, index: number): number {
    return (bitField & masks[index].mask) >> masks[index].shift;
  }

  function decode(bitField: number): ReadonlyArray<number> {
    const res: number[] = new Array(masks.length);
    for (let i = 0; i < masks.length; i++) {
      res[i] = getValueAt(bitField, i);
      // res[i] = (bitField & masks[i].mask) >> masks[i].shift;
    }
    return res;
  }

  return {
    encode,
    decode,
    setValueAt,
    getValueAt,
    length: shape.length,
  };
}
