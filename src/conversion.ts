import {
  createMatrix,
  Matrix,
  multiply,
  multiplyColor,
} from './matrices';
import { ColorArr } from './types';
import { colorCodec, ColorEncoding } from './colorCodex';

const rgbToLmsMValues = [
  0.31399022, 0.63951294, 0.04649755, // eslint-disable-line prettier/prettier
  0.15537241, 0.75789446, 0.08670142, // eslint-disable-line prettier/prettier
  0.01775239, 0.10944209, 0.87256922, // eslint-disable-line prettier/prettier
];

export const rgbToLmsM = createMatrix(3, 3, rgbToLmsMValues);

const lmsToRgbMValues = [
  5.47221206, -4.6419601, 0.16963708, // eslint-disable-line prettier/prettier
  -1.1252419, 2.29317094, -0.1678952, // eslint-disable-line prettier/prettier
  0.02980165, -0.19318073, 1.16364789, // eslint-disable-line prettier/prettier
];

export const lmsToRgbM = createMatrix(3, 3, lmsToRgbMValues);

export function convertColor(
  rgbColor: ColorArr,
  conversionM: Matrix<3, 3>,
): ColorArr {
  const colorM = createMatrix(1, 3, rgbColor);
  return multiply(conversionM, colorM).data as ColorArr;
}

export const rgbToLms = (rgbColor: number): number =>
  multiplyColor(rgbToLmsM, rgbColor);

export const lmsToRgb = (lmsColor: number): number =>
  multiplyColor(lmsToRgbM, lmsColor);

function sRgbToLinearComponent(sRgbComponent: number): number {
  const scaledComponent = sRgbComponent / 255;
  return scaledComponent <= 0.04045
    ? scaledComponent / 12.92
    : ((scaledComponent + 0.055) / 1.055) ** 2.4;
}

function linearToSRgbComponent(linearComponent: number): number {
  const sRgbComponent =
    linearComponent <= 0.0031308
      ? linearComponent * 12.92
      : 1.055 * linearComponent ** (1 / 2.4) - 0.055;
  return Math.round(sRgbComponent * 255);
}

function rgbToHsl(rgbColor: number): number {
  const r = colorCodec.getValueAt(rgbColor, 0);
  const g = colorCodec.getValueAt(rgbColor, 1);
  const b = colorCodec.getValueAt(rgbColor, 2);
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h;
  let s;

  if (max === min) h = 0;
  else if (r === max) h = (g - b) / delta;
  else if (g === max) h = 2 + (b - r) / delta;
  else h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);
  if (h < 0) h += 360;

  const l = (min + max) / 2;

  if (max === min) s = 0;
  else if (l <= 0.5) s = delta / (max + min);
  else s = delta / (2 - max - min);

  return colorCodec.encode(h / 360, s, l, ColorEncoding.HSL);
}

function hslToRgb(hslColor: number): number {
  const h = colorCodec.getValueAt(hslColor, 0);
  const s = colorCodec.getValueAt(hslColor, 1);
  const l = colorCodec.getValueAt(hslColor, 2);
  let t2;
  let t3;
  let val;

  if (s === 0) return colorCodec.encode(l, l, l, ColorEncoding.RGB);

  if (l < 0.5) t2 = l * (1 + s);
  else t2 = l + s - l * s;

  const t1 = 2 * l - t2;
  const rgb = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    t3 = h + (1 / 3) * -(i - 1);
    if (t3 < 0) t3++;
    if (t3 > 1) t3--;
    if (6 * t3 < 1) val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1) val = t2;
    else if (3 * t3 < 2) val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else val = t1;
    rgb[i] = val;
  }

  return colorCodec.encode(rgb[0], rgb[1], rgb[2], ColorEncoding.RGB);
}

export const Rgb = {
  create(r: number, g: number, b: number): number {
    return colorCodec.encode(
      sRgbToLinearComponent(r),
      sRgbToLinearComponent(g),
      sRgbToLinearComponent(b),
      ColorEncoding.RGB,
    );
  },
  to: {
    hsl(rgbColor: number): number {
      return rgbToHsl(rgbColor);
    },
    lms(rgbColor: number): number {
      return rgbToLms(rgbColor);
    },
    array(rgbColor: number): ColorArr {
      return [
        linearToSRgbComponent(colorCodec.getValueAt(rgbColor, 0)),
        linearToSRgbComponent(colorCodec.getValueAt(rgbColor, 1)),
        linearToSRgbComponent(colorCodec.getValueAt(rgbColor, 2)),
      ];
    },
  },
  from: {
    hsl(hslColor: number): number {
      return hslToRgb(hslColor);
    },
    lms(lmsColor: number): number {
      return lmsToRgb(lmsColor);
    },
  },
};

export const Hsl = {
  create(h: number, s: number, l: number): number {
    return colorCodec.encode(
      h / 360,
      s / 100,
      l / 100,
      ColorEncoding.HSL,
    );
  },
  to: {
    rgb(hslColor: number): number {
      return hslToRgb(hslColor);
    },
    lms(hslColor: number): number {
      return rgbToLms(hslToRgb(hslColor));
    },
    array(hslColor: number): ColorArr {
      return [
        colorCodec.getValueAt(hslColor, 0) * 360,
        colorCodec.getValueAt(hslColor, 1) * 100,
        colorCodec.getValueAt(hslColor, 2) * 100,
      ];
    },
  },
  from: {
    rgb(rgbColor: number): number {
      return rgbToHsl(rgbColor);
    },
    lms(lmsColor: number): number {
      return rgbToHsl(lmsToRgb(lmsColor));
    },
  },
};

export const Lms = {
  create(l: number, m: number, s: number): number {
    return colorCodec.encode(l, m, s, ColorEncoding.LMS);
  },
  to: {
    rgb(lmsColor: number): number {
      return lmsToRgb(lmsColor);
    },
    hsl(hslColor: number): number {
      return rgbToHsl(lmsToRgb(hslColor));
    },
    array(lmsColor: number): ColorArr {
      return [
        colorCodec.getValueAt(lmsColor, 0),
        colorCodec.getValueAt(lmsColor, 1),
        colorCodec.getValueAt(lmsColor, 2),
      ];
    },
  },
  from: {
    rgb(rgbColor: number): number {
      return rgbToLms(rgbColor);
    },
    hsl(hslColor: number): number {
      return rgbToLms(hslToRgb(hslColor));
    },
  },
};

// console.log(
//   'rgbToLms [0, 0.5, 1]',
//   pipe([0, 127, 255]).through(
//     ([r, g, b]) => Rgb.create(r, g, b),
//     tap(v => console.log(v)),
//     tap(v => console.log(Lms.to.array(v))),
//     rgbToLms,
//     tap(v => console.log(Lms.to.array(v))),
//     lmsToRgb,
//     tap(v => console.log(Lms.to.array(v))),
//     // tap(v => console.log(v)),
//     tap(v => console.log(Rgb.to.array(v))),
//   ),
// );
// console.log(
//   pipe([0, 0.5, 1] as ColorArr).through(
//     col => convertColor(col, rgbToLmsM),
//     col => convertColor(col, lmsToRgbM),
//     x => x.map(round),
//   ),
// );
