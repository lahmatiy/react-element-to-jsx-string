import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  name: 'createReactElementToJsxString',
  input: 'src/index.js',
  output: {
    file: 'dist/lib.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    resolve({
      browser: true,
      jsnext: true,
    }),
    commonjs(),
  ],
};
