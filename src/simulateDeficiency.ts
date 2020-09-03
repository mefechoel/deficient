import { multiplyColor, multiply } from './matrices';
import { Rgb, rgbToLmsMatrix, lmsToRgbMatrix } from './conversion';
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
  const toLmsSim = multiply(deficiencyMatrix, rgbToLmsMatrix);
  const toLmsSimToRgb = multiply(lmsToRgbMatrix, toLmsSim);
  const simulate = (r: number, g: number, b: number) => {
    const rgbColor = Rgb.create(r, g, b);
    const transformedRgbColor = multiplyColor(
      toLmsSimToRgb,
      rgbColor,
    );
    return Rgb.to.array(transformedRgbColor);
  };
  return simulate;
}
