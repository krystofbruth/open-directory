import { App } from "../dist/models/App.js";

test("Empty input", () => {
  expect(() => {
    new App();
  }).toThrow();
});

test("Invalid input", () => {
  expect(() => {
    new App({ a: 123 }, 546);
  }).toThrow();
});
