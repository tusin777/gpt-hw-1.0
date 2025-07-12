import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (relPath) => path.join(__dirname, "..", relPath);

function read(relPath) {
  try {
    return fs.readFileSync(resolve(relPath), "utf8");
  } catch {
    return "";
  }
}

// Функция для “нормализации” JS-кода: убирает все пробелы, табы и переводы строк
function normalizeJS(code) {
  return code.replace(/[\s;]/g, "");
}

describe("ACTUAL AUTHOR REPO: Full code parity check (robust)", () => {
  it("Корень содержит только нужные файлы и папки", () => {
    const allowed = [
      "package.json",
      "vite.config.js",
      "index.html",
      "public",
      "src",
      "node_modules",
      ".gitignore",
      "README.md",
      "eslint.config.js",
      "package-lock.json",
      "tests",
    ];
    const files = fs.readdirSync(resolve(""));
    files.forEach((f) => {
      if (!f.startsWith(".")) expect(allowed).toContain(f);
    });
  });

  it("public содержит только vite.svg", () => {
    const files = fs.readdirSync(resolve("public"));
    expect(files).toEqual(["vite.svg"]);
  });

  it("src содержит только main.jsx, components и assets", () => {
    const files = fs.readdirSync(resolve("src"));
    expect(files.sort()).toEqual(["assets", "components", "main.jsx"].sort());
  });

  it("components содержит App и MyName", () => {
    const files = fs.readdirSync(resolve("src/components"));
    expect(files.sort()).toEqual(["App", "MyName"].sort());
  });

  it("App папка содержит App.jsx и App.css", () => {
    const files = fs.readdirSync(resolve("src/components/App"));
    expect(files.sort()).toEqual(["App.css", "App.jsx"].sort());
  });

  it("MyName папка содержит MyName.jsx и MyName.css", () => {
    const files = fs.readdirSync(resolve("src/components/MyName"));
    expect(files.sort()).toEqual(["MyName.css", "MyName.jsx"].sort());
  });

  it("App.jsx — правильно импортирует MyName (именованный импорт) и стили", () => {
    const code = normalizeJS(read("src/components/App/App.jsx"));
    expect(code).toMatch(/import\{MyName\}from['"]\.\.\/MyName\/MyName['"]/);
    expect(code).toMatch(/import['"]\.\/App\.css['"]/);
    expect(code).toMatch(
      /<h1>Привет,React!<\/h1><p>ЭтомойпервыйReact-проектсVite<\/p><MyName\/>/
    );
    expect(code).toMatch(/exportdefaultApp/);
  });

  it("MyName.jsx — именованный экспорт, нужный JSX", () => {
    const code = read("src/components/MyName/MyName.jsx");
    const norm = normalizeJS(code);
    expect(norm).toMatch(
      /exportfunctionMyName\(\){return<h2>МенязовутАлексей<\/h2>}/
    );
  });

  it("main.jsx — импортирует App, StrictMode, createRoot, рендерит App", () => {
    const code = read("src/main.jsx");
    const norm = normalizeJS(code);
    expect(norm).toMatch(
      /import{StrictMode}from['"]react['"]import{createRoot}from['"]react-dom\/client['"]importAppfrom['"]\.\/components\/App\/App\.jsx['"]createRoot\(document\.getElementById\(['"]root['"]\)\)\.render\(<StrictMode><App\/><\/StrictMode>,\)/
    );
  });

  it("Нет лишних импортов, переменных, шаблонного мусора", () => {
    ["src/components/App/App.jsx", "src/components/MyName/MyName.jsx"].forEach(
      (file) => {
        const code = read(file);
        [
          "logo",
          "viteLogo",
          "reactLogo",
          "useState",
          "useEffect",
          "counter",
          "setCount",
        ].forEach((word) => {
          expect(code).not.toMatch(new RegExp(word));
        });
      }
    );
  });
});
