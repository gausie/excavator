/* eslint-env node */
import esbuild from "esbuild";
import babel from "esbuild-plugin-babel";
import process from "process";
import fs from "fs";

const args = process.argv.slice(2);

const watch = args.some((a) => a === "--watch" || a === "-w");

const watchPlugin = {
  name: "watch",
  setup(build) {
    if (!watch) return;
    build.onEnd((result) => {
      const date = new Date();
      console.log(
        `[${date.toISOString()}] Build ${
          result.errors.length ? "failed" : "succeeded"
        }.`,
      );
    });
  },
};

const context = await esbuild.context({
  entryPoints: {
    excavator: "src/excavator.ts",
  },
  bundle: true,
  minifySyntax: true,
  platform: "node",
  target: "rhino1.7.14",
  external: ["kolmafia"],
  plugins: [babel(), watchPlugin],
  outdir: "dist/scripts/excavator",
  loader: { ".json": "text" },
  inject: ["./kolmafia-polyfill.js"],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

await context.rebuild();

fs.writeFileSync("dist/scripts/excavator.ash", "set_property(\"spadingScript\", \"excavator.js\");")

if (watch) {
  await context.watch();
} else {
  context.dispose();
}
