import typescript2 from 'rollup-plugin-typescript2';
import autoExternal from 'rollup-plugin-auto-external';

const base = {
  plugins: [autoExternal(), typescript2()],
};

export default [
  {
    ...base,
    input: './src/cliMain.ts',
    output: {
      file: './lib/cliMain.js',
      format: 'cjs',
    },
  },
];
