import path from "node:path";

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow hard-coded hex/rgb colors — use Tailwind tokens from app/globals.css instead.",
    },
    messages: {
      noHardcodedColor:
        "Hard-coded color detected ({{value}}). Use Tailwind design tokens (e.g. bg-background, text-foreground, brand-blue) from app/globals.css — see .ai/skills/design-system/SKILL.md and DESIGN.md. Never use inline hex or rgb() in className.",
    },
    schema: [],
  },
  create(context) {
    if (
      context.filename.includes(`${path.sep}eslint-rules${path.sep}`) ||
      context.filename.includes(`${path.sep}lib${path.sep}design-tokens.ts`)
    ) {
      return {};
    }

    const hexPattern = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
    const rgbPattern = /\brgb\s*\(/;

    function checkStringValue(node, value) {
      if (!value || typeof value !== "string") return;
      if (hexPattern.test(value) || rgbPattern.test(value)) {
        context.report({
          node,
          messageId: "noHardcodedColor",
          data: {
            value: value.length > 40 ? `${value.slice(0, 40)}...` : value,
          },
        });
      }
    }

    return {
      Literal(node) {
        if (typeof node.value === "string") {
          checkStringValue(node, node.value);
        }
      },
      TemplateElement(node) {
        checkStringValue(node, node.value.raw);
      },
    };
  },
};

export default rule;
