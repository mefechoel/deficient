import { multiplyColor } from './matrices';
import { Rgb } from './conversion';
import {
  Deficiency,
  createDeficiencyMatrix,
} from './deficiencyMatrices';

export type SimulateFn = (
  r: number,
  g: number,
  b: number,
) => [number, number, number];

export function createSimulator(
  type: Deficiency,
  severity: number,
): SimulateFn {
  const deficiencyMatrix = createDeficiencyMatrix(type, severity);
  const simulate = (r: number, g: number, b: number) => {
    const rgbColor = Rgb.create(r, g, b);
    const lmsColor = Rgb.to.lms(rgbColor);
    const transformedLmsColor = multiplyColor(
      deficiencyMatrix,
      lmsColor,
    );
    const transformedRgbColor = Rgb.from.lms(transformedLmsColor);
    return Rgb.to.array(transformedRgbColor);
  };
  return simulate;
}
