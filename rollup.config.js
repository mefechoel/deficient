import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: {
    sourcemap: true,
    format: 'es',
    name: 'app',
    dir: 'dist',
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfigOverride: { compilerOptions: { module: 'ESNext' } },
    }),
  ],
};
