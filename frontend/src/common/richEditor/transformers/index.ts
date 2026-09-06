import { TRANSFORMERS } from "@lexical/markdown";
import { TABLE } from "./table";

/**
 * Full set of markdown transformers used by RichEditor: Lexical's built-in
 * transformers (headings, lists, bold/italic, links, etc.) plus our custom
 * TABLE transformer, which adds markdown pipe-table import/export support.
 */
export const RICH_EDITOR_TRANSFORMERS = [TABLE, ...TRANSFORMERS];

export { TABLE };
