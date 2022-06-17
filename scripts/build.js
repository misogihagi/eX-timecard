const fsp = require('fs/promises')
const { build } = require('esbuild');

const sdir = __dirname +'/../src/public/';
const ddir = __dirname +'/../dist/';

(async ()=>{
  try{
    await fsp.mkdir(ddir)
  }catch{
  }finally{
    await Promise.all(
      (await fsp.readdir(sdir))
        .map(f=>fsp.copyFile(sdir+f,ddir+f))
    )
  }
})()

build({
  entryPoints: ["src/main.js"],
  bundle: true,
  outfile: "./dist/bundle.js",
});