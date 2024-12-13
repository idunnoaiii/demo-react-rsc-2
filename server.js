import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { build as esbuild } from "esbuild";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import fs from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { serveStatic } from "@hono/node-server/serve-static";
import * as ReactDomServer from "react-server-dom-webpack/server.browser";
import { parse } from "es-module-lexer";
import { relative } from "node:path";

const app = new Hono();
const clientComponents = {};

app.get("/", async (c) => {
  return c.html(`
  <!DOCTYPE html>
  <html>
    <head>
      <title>hello server component</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/build/_client.js"></script>
    </body>
  `);
});

app.use("/build/*", serveStatic());

app.get("/rsc", async () => {
  const page = await import("./build/page.js");
  // const html = renderToString(createElement(page.default));
  const stream = ReactDomServer.renderToReadableStream(
    createElement(page.default),
    clientComponents
  );
  return new Response(stream);
});

serve(app, async (info) => {
  await build();
  console.log("listening on", info.port);
}).addListener("close", () => {
  console.log("closed");
  fs.rmSync(resolveBuild(), { recursive: true });
});

async function build() {
  const clientEntryPoints = new Set();

  await esbuild({
    bundle: true,
    format: "esm",
    logLevel: "error",
    entryPoints: [resolveApp("page.jsx")],
    outdir: resolveBuild(),
    packages: "external",
    plugins: [
      {
        name: "resolve-client-import",
        setup(build) {
          build.onResolve(
            { filter: /\.jsx$/ },
            async ({ path: relativePath }) => {
              console.log("resolve", relativePath);
              const path = resolveApp(relativePath);
              const contents = await readFile(path, "utf8");
              if (contents.startsWith('"use client"')) {
                clientEntryPoints.add(path);
                return {
                  external: true,
                  path: relativePath.replace(/\.jsx$/, ".js"),
                };
              }
            }
          );
        },
      },
    ],
  });
  const { outputFiles } = await esbuild({
    bundle: true,
    format: "esm",
    logLevel: "error",
    entryPoints: [resolveApp("_client.jsx"), ...clientEntryPoints],
    outdir: resolveBuild(),
    splitting: true,
    plugins: [],
    write: false,
  });

  outputFiles.forEach(async (file) => {
    const [, exports] = parse(file.text);
    let newContents = file.text;

    for (const exp of exports) {
      const key = file.path + exp.n;
      clientComponents[key] = {
        id: `/build/${relative(resolveBuild(), file.path)}`,
        name: exp.n,
        chunks: [],
        async: true,
      };

      newContents += `
${exp.ln}.$$typeof = Symbol.for('react.client.reference');
${exp.ln}.$$id = ${JSON.stringify(key)};
      `;
    }

    // console.log(clientComponents)

    await writeFile(file.path, newContents);
  });
}

const appDir = new URL("./app/", import.meta.url);
const buildDir = new URL("./build/", import.meta.url);

function resolveApp(path = "") {
  return fileURLToPath(new URL(path, appDir));
}

function resolveBuild(path = "") {
  return fileURLToPath(new URL(path, buildDir));
}
