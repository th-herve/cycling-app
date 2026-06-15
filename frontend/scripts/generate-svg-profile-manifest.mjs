import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgDir = path.join(__dirname, "../public/profiles");

// Output TS file.
const outputFile = path.join(__dirname, "../generated/svg-manifest.ts");

// Ensure the generated directory exists.
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

const files = fs.readdirSync(svgDir);

const ids = [];

for (const file of files) {
  if (file.endsWith(".svg")) {
    const id = path.basename(file, ".svg");
    ids.push(id);
  }
}

// Generate TS module.
const content = `// AUTO-GENERATED FILE — DO NOT EDIT

export const svgManifest = new Set([
${ids.map(id => `  "${id}"`).join(",\n")}
]);
`;

fs.writeFileSync(outputFile, content);

console.log("SVG Set manifest generated:", outputFile);
