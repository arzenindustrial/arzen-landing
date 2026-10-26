// Copia el worker de pdf.js a /public (se sirve desde el mismo origen; nada de CDN externo).
import fs from "node:fs";
import path from "node:path";
const src = path.resolve("node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js");
const dst = path.resolve("public/pdf.worker.min.js");
fs.copyFileSync(src, dst);
console.log("pdf.js worker -> public/pdf.worker.min.js");
