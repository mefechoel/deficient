import { Matrix, createMatrix } from './matrices';

export function createProtanMatrix(severity: number): Matrix<3, 3> {
  const matrix = [
    (1 - severity), (severity * 1.0511829410), (severity * -0.05116099), // eslint-disable-line prettier/prettier
    0, 1, 0, // eslint-disable-line prettier/prettier
    0, 0, 1, // eslint-disable-line prettier/prettier
  ];
  return createMatrix(3, 3, matrix);
}

export function createDeutanMatrix(severity: number): Matrix<3, 3> {
  const matrix = [
    1, 0, 0, // eslint-disable-line prettier/prettier
    (severity * 0.9513092), (1 - severity), (severity * 0.04866992), // eslint-disable-line prettier/prettier
    0, 0, 1, // eslint-disable-line prettier/prettier
  ];
  return createMatrix(3, 3, matrix);
}

export function createTritanMatrix(severity: number): Matrix<3, 3> {
  const matrix = [
    1, 0, 0, // eslint-disable-line prettier/prettier
    0, 1, 0, // eslint-disable-line prettier/prettier
    (severity * -0.86744736), (severity * 1.86727089), (1 - severity), // eslint-disable-line prettier/prettier
  ];
  return createMatrix(3, 3, matrix);
}

export enum Deficiency {
  Protan = 'protan',
  Deutan = 'deutan',
  Tritan = 'tritan',
}

const deficiencyMatrixFactories = {
  [Deficiency.Protan]: createProtanMatrix,
  [Deficiency.Deutan]: createDeutanMatrix,
  [Deficiency.Tritan]: createTritanMatrix,
};

export function createDeficiencyMatrix(
  type: Deficiency,
  severity: number,
): Matrix<3, 3> {
  const matrixFactory = deficiencyMatrixFactories[type];
  return matrixFactory(severity);
}
