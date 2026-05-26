/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow inline style props — use Tailwind classes and design tokens instead.",
    },
    messages: {
      noInlineStyle:
        "Inline JSX style attributes are banned. Use Tailwind classes and tokens from app/globals.css — see .ai/skills/design-system/SKILL.md. If a dynamic value is truly required, extract a typed utility in lib/ with a comment explaining why Tailwind cannot cover it.",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (
          node.name.type === "JSXIdentifier" &&
          node.name.name === "style" &&
          node.value?.type === "JSXExpressionContainer"
        ) {
          context.report({ node, messageId: "noInlineStyle" });
        }
      },
    };
  },
};

export default rule;
