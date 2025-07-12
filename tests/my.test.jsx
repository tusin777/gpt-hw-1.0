/* eslint-env node */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, "..", p);
const read = (p) => fs.readFileSync(resolve(p), "utf8");

describe("Урок 1.5 — JSX: синтаксис и правила", () => {
  const appPath = "src/components/App/App.jsx";
  const emailPath = "src/components/Email.jsx";
  const myNamePath = "src/components/MyName/MyName.jsx";
  const appCode = read(appPath);
  const emailCode = read(emailPath);
  const myNameCode = read(myNamePath);

  it("App импортирует MyName и Email", () => {
    expect(appCode).toMatch(
      /import\s+\{\s*MyName\s*\}\s+from\s+['"]\.\.\/MyName\/MyName['"];/
    );
    expect(appCode).toMatch(
      /import\s+\{\s*Email\s*\}\s+from\s+['"]\.\.\/Email['"];/
    );
  });

  it("App содержит переменные name, element, condition, response", () => {
    expect(appCode).toMatch(/const\s+name\s*=\s*['"]Вася Пупкин['"];/);
    expect(appCode).toMatch(
      /const\s+element\s*=\s*<h1>Алексей и \{name\} - друзья<\/h1>/
    );
    expect(appCode).toMatch(/const\s+condition\s*=\s*true/);
    expect(appCode).toMatch(/const\s+response\s*=\s*['"].*alert.*['"]/);
  });

  it("App возвращает JSX во фрагменте", () => {
    expect(appCode).toMatch(/return\s*\(\s*<>\s*[\s\S]*<\/>/);
  });

  it("App содержит JSX-элементы из задания", () => {
    expect(appCode).toMatch(/\{element\}/);
    expect(appCode).toMatch(/dangerouslySetInnerHTML/);
    expect(appCode).toMatch(/\{condition\s*&&\s*<MyName\s*\/?>\}/);
    expect(appCode).toMatch(/<Email\s*\/>/);
    expect(appCode).toMatch(
      /<input[^>]*type=["']checkbox["'][^>]*checked=\{false\}/
    );
    expect(appCode).toMatch(/<img[^>]*alt=/);
    expect(appCode).toMatch(/<label[^>]*htmlFor=/);
    expect(appCode).toMatch(/<button[^>]*disabled/);
  });

  it("Email — это именованный компонент, проверяющий email через regex", () => {
    expect(emailCode).toMatch(/export function Email\(\)/);
    expect(emailCode).toMatch(/const\s+email\s*=\s*['"].+@.+\..+['"]/);
    expect(emailCode).toMatch(/emailRegex\.test\(email\)/);
    expect(emailCode).toMatch(/return\s+check\s*\?/);
  });

  it("MyName рендерит массив кошек со стилями", () => {
    expect(myNameCode).toMatch(
      /const\s+cats\s*=\s*\[.*['"]Лев['"].*['"]Тигр['"].*['"]Пума['"]\]/
    );
    expect(myNameCode).toMatch(
      /<ul[^>]*style=\{\{[^}]*color.*fontSize.*backgroundColor[^}]*\}\}/
    );
    expect(myNameCode).toMatch(/cats\.map/);
  });
});
