import type { EditorThemeClasses } from "lexical";

/**
 * Ported from Lexical playground's utils/getThemeSelector.ts.
 * Builds a CSS selector (e.g. ".foo.bar") from a theme class name entry.
 */
export function getThemeSelector(
  getTheme: () => EditorThemeClasses | null | undefined,
  name: keyof EditorThemeClasses
): string {
  const className = getTheme()?.[name];
  if (typeof className !== "string") {
    throw new Error(
      `getThemeSelector: required theme property ${name} not defined`
    );
  }
  return className
    .split(/\s+/g)
    .map((cls) => `.${cls}`)
    .join("");
}
