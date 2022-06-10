const { build } = require('esbuild');


build({
  entryPoints: ["src/main.js"],
  bundle: true,
  outfile: "./dist/bundle.js",
});