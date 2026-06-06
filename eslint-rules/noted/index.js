import noHardcodedColor from "./no-hardcoded-color.js";
import noInlineStyle from "./no-inline-style.js";

/** @type {import('eslint').ESLint.Plugin} */
const notedPlugin = {
  meta: {
    name: "eslint-plugin-noted",
    version: "1.0.0",
  },
  rules: {
    "no-hardcoded-color": noHardcodedColor,
    "no-inline-style": noInlineStyle,
  },
};

export default notedPlugin;
