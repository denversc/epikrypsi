import pluginJs from "@eslint/js";
import securityPlugin from "eslint-plugin-security";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unicornPlugin from "eslint-plugin-unicorn";
import globals from "globals";
import tsPlugin, { type ConfigArray } from "typescript-eslint";

const config: ConfigArray = tsPlugin.config(
  pluginJs.configs.recommended,
  tsPlugin.configs.strictTypeChecked,
  securityPlugin.configs.recommended,
  {
    files: ["**/*.ts"],
    ignores: ["build/**/*"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.ts"],
          defaultProject: "tsconfig.eslint.json",
        },
      },
    },
    rules: {
      "func-style": ["error", "expression"],
      "no-restricted-syntax": ["off", "ForOfStatement"],
      "no-console": ["error"],
      "prefer-template": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
  {
    ignores: ["build/**/*"],
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
);

export default config;
