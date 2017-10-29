import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  name: 'createReactElementToJsxString',
  input: 'src/index.js',
  output: {
    format: 'umd',
    sourcemap: 'inline',
  },
  plugins: [resolve({ browser: true }), commonjs()],
};
