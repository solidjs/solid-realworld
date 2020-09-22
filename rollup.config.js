import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";
import purgecss from 'rollup-plugin-purgecss';

const plugins = [
  del({
    targets: ["public/*", "!public/index.html"],
    watch: true
  }),
  babel({
    exclude: "node_modules/**",
    presets: ["solid"],
    plugins: ["@babel/syntax-dynamic-import", "@babel/plugin-proposal-optional-chaining"]
  }),
  resolve({ extensions: [".js", ".jsx"] }),
  commonjs(),
  process.env.production && terser(),
  process.env.production && purgecss({
    content: ["public/index.html"]
  })
];

export default {
  input: "src/index.js",
  output: {
    dir: "public",
    format: "esm"
  },
  preserveEntrySignatures: false,
  plugins
};
