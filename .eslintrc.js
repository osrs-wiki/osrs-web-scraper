module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "prettier",
  ],
  rules: {
    "import/namespace": "off",
    "import/no-unresolved": "off",
    "import/order": [
      "warn",
      {
        "alphabetize": {
          order: "asc",
          caseInsensitive: true,
        },
        "groups": [
          ["builtin", "external"],
          "internal",
          ["sibling", "parent", "index"],
          "object",
        ],
        "newlines-between": "always",
        "pathGroupsExcludedImportTypes": ["builtin"],
      },
    ],
  },
};
