import { RuleTester } from "eslint";
import noHardcodedColor from "./no-hardcoded-color.js";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-hardcoded-color", noHardcodedColor, {
  valid: [
    'const x = "bg-background text-foreground";',
    'const y = "text-brand-blue";',
    '<div className="rounded-md border" />',
  ],
  invalid: [
    {
      code: 'const x = "text-[#3F3F3F]";',
      errors: [{ messageId: "noHardcodedColor" }],
    },
    {
      code: '<div className="dark:bg-[#1F1F1F]" />',
      errors: [{ messageId: "noHardcodedColor" }],
    },
  ],
});
