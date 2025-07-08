/* global describe, it, expect, process, __dirname */
/* eslint-env node */
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

// Универсальный список разрешённых файлов/папок для обычного Vite/React-проекта
const allowed = [
  "package.json",
  "vite.config.js",
  "index.html",
  "public",
  "src",
  "node_modules",
  ".gitignore",
  "eslint.config.js",
  "package-lock.json",
  "README.md",
  "tests", // разрешаем папку для автотестов
  // любые другие свои файлы добавь сюда при необходимости
];

describe("Project structure: адекватная чистота и совпадение с автором", () => {
  it("В корне проекта только нужные файлы и папки", () => {
    const files = fs.readdirSync(resolve(""));
    files.forEach((f) => {
      if (!f.startsWith(".")) expect(allowed).toContain(f);
    });
  });

  it("public содержит vite.svg", () => {
    const publicDir = resolve("public");
    if (!fs.existsSync(publicDir)) return; // если вдруг папка удалена
    const files = fs.readdirSync(publicDir);
    expect(files).toContain("vite.svg");
  });

  it("src содержит main.jsx и components/", () => {
    const srcDir = resolve("src");
    const files = fs.readdirSync(srcDir);
    expect(files).toEqual(expect.arrayContaining(["components", "main.jsx"]));
  });

  it("src/components содержит только App и MyName", () => {
    const compDir = resolve("src/components");
    const files = fs.readdirSync(compDir);
    expect(files.sort()).toEqual(expect.arrayContaining(["App", "MyName"]));
  });

  it("App папка содержит App.jsx и App.css", () => {
    const files = fs.readdirSync(resolve("src/components/App"));
    expect(files.sort()).toEqual(
      expect.arrayContaining(["App.css", "App.jsx"])
    );
  });

  it("MyName папка содержит MyName.jsx и MyName.css", () => {
    const files = fs.readdirSync(resolve("src/components/MyName"));
    expect(files.sort()).toEqual(
      expect.arrayContaining(["MyName.css", "MyName.jsx"])
    );
  });

  it("App.jsx — корректный импорт, экспорт и JSX", () => {
    const code = read("src/components/App/App.jsx");
    expect(code).toMatch(/import MyName from ["']\.\.\/MyName\/MyName["']/);
    expect(code).toMatch(/import ["']\.\/App\.css["']/);
    expect(code).toMatch(/export default App/);
    // Можно сделать регулярку чуть более мягкой, если боишься из-за пробелов
    expect(code.replace(/\s+/g, " ")).toMatch(
      /<div> <h1>Привет, React!<\/h1> <p>Это мой первый React проект\.?<\/p> <MyName \/> <\/div>/
    );
  });

  it("MyName.jsx — корректный импорт, экспорт и JSX", () => {
    const code = read("src/components/MyName/MyName.jsx");
    expect(code).toMatch(/import ["']\.\/MyName\.css["']/);
    expect(code).toMatch(/export default MyName/);
    expect(code.replace(/\s+/g, " ")).toMatch(/<h2>Меня зовут Алексей<\/h2>/);
  });

  it("main.jsx импортирует App", () => {
    const code = read("src/main.jsx");
    expect(code).toMatch(/import App from ["']\.\/components\/App\/App["']/);
  });

  it("Нет лишних импортов и кода в App.jsx/MyName.jsx", () => {
    ["src/components/App/App.jsx", "src/components/MyName/MyName.jsx"].forEach(
      (file) => {
        const code = read(file);
        ["logo", "viteLogo", "reactLogo", "useState", "useEffect"].forEach(
          (word) => {
            expect(code).not.toMatch(new RegExp(word));
          }
        );
      }
    );
  });
});
