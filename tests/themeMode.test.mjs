import test from "node:test";
import assert from "node:assert/strict";

import { getStoredTheme, getToggledTheme, isDarkTheme } from "../js/themeMode.js";

test("reads dark theme from localStorage", () => {
  const storage = new Map([["todoTheme", "dark"]]);

  assert.equal(getStoredTheme({ getItem: (key) => storage.get(key) }), "dark");
});

test("falls back to light theme when stored value is invalid", () => {
  const storage = new Map([["todoTheme", "blue"]]);

  assert.equal(getStoredTheme({ getItem: (key) => storage.get(key) }), "light");
});

test("toggles between light and dark themes", () => {
  assert.equal(getToggledTheme("light"), "dark");
  assert.equal(getToggledTheme("dark"), "light");
});

test("detects only dark as dark theme", () => {
  assert.equal(isDarkTheme("dark"), true);
  assert.equal(isDarkTheme("light"), false);
});
