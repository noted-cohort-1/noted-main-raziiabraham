import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import notedPlugin from "./eslint-rules/noted/index.js";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "convex/_generated/**",
      "coverage/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "@typescript-eslint": tsPlugin,
      noted: notedPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/no-unknown-property": "off",
      "react-hooks/set-state-in-effect": "off",
      // Ratchet to "error" after legacy `any` cleanup (see typescript-patterns skill).
      "@typescript-eslint/no-explicit-any": [
        "warn",
        {
          fixToUnknown: false,
          ignoreRestArgs: false,
        },
      ],
      // Custom rules with AI-friendly messages — warn on legacy code, error on new violations in CI once cleaned up.
      "noted/no-hardcoded-color": "warn",
      "noted/no-inline-style": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/*.test.{js,jsx}", "**/jest.setup.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["components/ui/**/*.{ts,tsx}"],
    rules: {
      "noted/no-hardcoded-color": "off",
      "noted/no-inline-style": "off",
    },
  },
];

export default eslintConfig;
