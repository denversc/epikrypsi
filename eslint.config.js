import pluginJs from "@eslint/js";
import securityPlugin from "eslint-plugin-security";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unicornPlugin from "eslint-plugin-unicorn";
import globals from "globals";
import tsPlugin from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tsPlugin.configs.recommended,
  securityPlugin.configs.recommended,
  {
    files: ["**/*.ts"],
    ignores: ["build/**/*"],
    languageOptions: { globals: globals.node },
    rules: {
      "func-style": ["error", "expression"],
      "no-restricted-syntax": ["off", "ForOfStatement"],
      "no-console": ["error"],
      "prefer-template": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
  unicornPlugin.configs.all,
  {
    rules: {
      "unicorn/empty-brace-spaces": "off",
      "unicorn/no-null": "off",
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSortPlugin,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
];
