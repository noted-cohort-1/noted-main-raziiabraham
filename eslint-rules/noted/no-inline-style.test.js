import { RuleTester } from "eslint";
import noInlineStyle from "./no-inline-style.js";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-inline-style", noInlineStyle, {
  valid: ['<div className="h-4 w-full bg-muted" />'],
  invalid: [
    {
      code: "<div style={{ width: 100 }} />",
      errors: [{ messageId: "noInlineStyle" }],
    },
  ],
});
