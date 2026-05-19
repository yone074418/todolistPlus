export const THEME_STORAGE_KEY = "todoTheme";
export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";

const themes = new Set([LIGHT_THEME, DARK_THEME]);

export function getStoredTheme(storage = localStorage) {
  try {
    const theme = storage.getItem(THEME_STORAGE_KEY);
    return themes.has(theme) ? theme : LIGHT_THEME;
  } catch {
    return LIGHT_THEME;
  }
}

export function getToggledTheme(theme) {
  return theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
}

export function isDarkTheme(theme) {
  return theme === DARK_THEME;
}
